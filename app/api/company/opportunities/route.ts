import { NextResponse } from "next/server";
import { getDatabase, saveDatabase, OpportunityRecord } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");

    const db = await getDatabase();
    let list = db.opportunities || [];

    if (companyId) {
      list = list.filter((o) => o.company_id === companyId);
    }

    return NextResponse.json(list);
  } catch (error) {
    console.error("Error in company opportunities GET:", error);
    return NextResponse.json({ error: "Failed to fetch opportunities" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const opportunityData: Partial<OpportunityRecord> = await request.json();
    const db = await getDatabase();

    const company = db.companies.find((c) => c.company_id === opportunityData.company_id);

    // Only verified companies can publish
    if (opportunityData.status === "Published" && company && company.is_verified === false) {
      return NextResponse.json(
        { error: "Only verified Industry Partners can publish opportunities." },
        { status: 403 }
      );
    }

    const shortCo = company ? company.company_name.split(" ")[0].replace(/[^a-zA-Z]/g, "") : "CO";

    const newOpportunity: OpportunityRecord = {
      id: `opp-${Date.now()}`,
      company_id: opportunityData.company_id || "CO001",
      title: opportunityData.title || "Untitled Opportunity",
      type: opportunityData.type || "INTERNSHIP",
      status: opportunityData.status || "Published",
      domain: opportunityData.domain || "Information Technology",
      location: opportunityData.location || "Mumbai",
      work_mode: opportunityData.work_mode || "On-site",
      requiredSkills: opportunityData.requiredSkills || [],
      softSkills: opportunityData.softSkills || [],
      skillProficiency: opportunityData.skillProficiency || "Intermediate",
      mandatorySkills: opportunityData.mandatorySkills || opportunityData.requiredSkills || [],
      preferredSkills: opportunityData.preferredSkills || [],
      eligibilityCriteria: opportunityData.eligibilityCriteria || {
        minCGPA: 6.0,
        targetGradYears: [2026, 2027],
        degree: "Graduation / Diploma",
      },
      duration: opportunityData.duration || "6 Months",
      stipend: opportunityData.stipend || "₹20,000 / month",
      salaryPackage: opportunityData.salaryPackage || "N/A",
      experienceRequirement: opportunityData.experienceRequirement || "Fresher",
      availableSeats: opportunityData.availableSeats || 5,
      description: opportunityData.description || "",
      responsibilities: opportunityData.responsibilities || "",
      learningOutcomes: opportunityData.learningOutcomes || "",
      requiredDocuments: opportunityData.requiredDocuments || ["Resume"],
      selectionProcess: opportunityData.selectionProcess || "Technical & HR Assessment",
      applicationDeadline: opportunityData.applicationDeadline || "2026-10-30",
      publishedAt: new Date().toISOString().split("T")[0],
      applicantsCount: 0,
      shortlistedCount: 0,
      selectedCount: 0,
      co: shortCo,
      bg: "#eaf1ff",
      color: "#2563eb",
    };

    if (!db.opportunities) db.opportunities = [];
    db.opportunities.unshift(newOpportunity);

    // Also sync with main internships list if type is INTERNSHIP
    if (newOpportunity.type === "INTERNSHIP" || newOpportunity.type === "JOB") {
      const syncInternship = {
        id: newOpportunity.id,
        title: newOpportunity.title,
        organization: company ? company.company_name : "Partner Company",
        domain: newOpportunity.domain,
        location: newOpportunity.location,
        requiredSkills: newOpportunity.requiredSkills,
        eligibilityCriteria: {
          minCGPA: newOpportunity.eligibilityCriteria.minCGPA,
          targetGradYears: newOpportunity.eligibilityCriteria.targetGradYears,
        },
        duration: newOpportunity.duration,
        stipend: newOpportunity.stipend,
        availableSeats: newOpportunity.availableSeats,
        description: newOpportunity.description,
        co: shortCo,
        bg: "#eaf1ff",
        color: "#2563eb",
      };
      db.internships.unshift(syncInternship);
    }

    await saveDatabase(db);
    return NextResponse.json(newOpportunity, { status: 201 });
  } catch (error) {
    console.error("Error in company opportunities POST:", error);
    return NextResponse.json({ error: "Failed to create opportunity" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedData: Partial<OpportunityRecord> & { id: string } = await request.json();
    const db = await getDatabase();

    if (!db.opportunities) db.opportunities = [];
    const index = db.opportunities.findIndex((o) => o.id === updatedData.id);

    if (index === -1) {
      return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
    }

    db.opportunities[index] = {
      ...db.opportunities[index],
      ...updatedData,
    };

    // Update in main internships list if present
    const intIndex = db.internships.findIndex((i) => i.id === updatedData.id);
    if (intIndex !== -1) {
      db.internships[intIndex] = {
        ...db.internships[intIndex],
        title: updatedData.title || db.internships[intIndex].title,
        domain: updatedData.domain || db.internships[intIndex].domain,
        location: updatedData.location || db.internships[intIndex].location,
        requiredSkills: updatedData.requiredSkills || db.internships[intIndex].requiredSkills,
        description: updatedData.description || db.internships[intIndex].description,
      };
    }

    await saveDatabase(db);
    return NextResponse.json(db.opportunities[index]);
  } catch (error) {
    console.error("Error in company opportunities PUT:", error);
    return NextResponse.json({ error: "Failed to update opportunity" }, { status: 500 });
  }
}
