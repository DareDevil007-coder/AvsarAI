import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId") || "CO001";

    const db = await getDatabase();

    const companyOpportunities = (db.opportunities || []).filter((o) => o.company_id === companyId);
    const oppIds = companyOpportunities.map((o) => o.id);

    const companyApplications = db.applications.filter((a) => oppIds.includes(a.internshipId));

    // Calculate conversion metrics
    const totalApplicants = companyApplications.length;
    const shortlistedCount = companyApplications.filter((a) => a.status === "Shortlisted").length;
    const interviewedCount = companyApplications.filter((a) => a.status === "Interview").length;
    const selectedCount = companyApplications.filter((a) => a.status === "Selected").length;
    const rejectedCount = companyApplications.filter((a) => a.status === "Rejected").length;
    const conversionRatio = totalApplicants > 0 ? ((selectedCount / totalApplicants) * 100).toFixed(1) : "0.0";

    // 1. Most Demanded Skills in Company Opportunities
    const companySkillDemandMap: Record<string, number> = {};
    companyOpportunities.forEach((opp) => {
      (opp.requiredSkills || []).forEach((skill) => {
        const normalized = skill.trim();
        companySkillDemandMap[normalized] = (companySkillDemandMap[normalized] || 0) + 1;
      });
    });

    const companyTotalOpps = companyOpportunities.length || 1;
    const companySkillDemandStats = Object.keys(companySkillDemandMap)
      .map((skill) => ({
        skill,
        count: companySkillDemandMap[skill],
        percentage: Math.round((companySkillDemandMap[skill] / companyTotalOpps) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    // 2. High-demand / Low-supply skills calculated against actual Student Profiles in database
    const studentProfilesArray = Object.values(db.profiles || {});
    const totalStudentsInDb = studentProfilesArray.length || 1;

    const studentSkillSupplyMap: Record<string, number> = {};
    studentProfilesArray.forEach((profile) => {
      (profile.skills || []).forEach((skill) => {
        const normalized = skill.trim();
        studentSkillSupplyMap[normalized] = (studentSkillSupplyMap[normalized] || 0) + 1;
      });
    });

    // High-Demand vs Low-Supply analysis
    const skillSupplyDemandAnalysis = companySkillDemandStats.map((item) => {
      const studentSupplyCount = studentSkillSupplyMap[item.skill] || 0;
      const studentSupplyPercentage = Math.round((studentSupplyCount / totalStudentsInDb) * 100);
      const gap = Math.max(0, item.percentage - studentSupplyPercentage);

      return {
        skill: item.skill,
        companyDemandPercentage: item.percentage,
        studentSupplyPercentage,
        gap,
        status: gap > 30 ? "High Gap / Low Supply" : gap > 10 ? "Moderate Gap" : "Balanced Supply",
      };
    });

    return NextResponse.json({
      companyId,
      totalOpportunities: companyOpportunities.length,
      totalApplicants,
      shortlistedCount,
      interviewedCount,
      selectedCount,
      rejectedCount,
      conversionRatio: `${conversionRatio}%`,
      companySkillDemandStats,
      skillSupplyDemandAnalysis,
    });
  } catch (error) {
    console.error("Error in company analytics GET:", error);
    return NextResponse.json({ error: "Failed to calculate recruitment analytics" }, { status: 500 });
  }
}
