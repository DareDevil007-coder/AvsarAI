import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { calculateMatch, normalizeInternshipRecord } from "@/lib/matching";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const candidateId = searchParams.get("candidateId") || searchParams.get("userId");

    const db = await getDatabase();
    
    // Find candidate profile if available
    let profile = null;
    if (candidateId && db.profiles[candidateId]) {
      profile = db.profiles[candidateId];
    } else {
      // Fallback to first profile if available
      const firstKey = Object.keys(db.profiles)[0];
      if (firstKey) {
        profile = db.profiles[firstKey];
      }
    }

    // Dynamic extraction of all internship records in database
    let rawList: any[] = [];
    if (Array.isArray(db)) {
      rawList = db;
    } else if (db && typeof db === "object") {
      const excludedKeys = new Set([
        "users",
        "profiles",
        "skills_master",
        "districts_master",
        "sectors_master",
        "applications",
        "interviews",
        "notifications",
        "ai_recommendations"
      ]);

      Object.keys(db).forEach((key) => {
        if (!excludedKeys.has(key) && Array.isArray((db as any)[key])) {
          rawList.push(...(db as any)[key]);
        }
      });
    }

    const seenIds = new Set<string>();
    const allInternships = rawList
      .map((item) => normalizeInternshipRecord(item))
      .filter((item) => {
        if (!item.id || seenIds.has(item.id)) return false;
        seenIds.add(item.id);
        return true;
      });

    if (profile && allInternships.length > 0) {
      // Calculate matching score across ALL database internships
      const matches = allInternships.map((internship) => {
        const computed = calculateMatch(profile, internship);
        const storedRec = db.ai_recommendations?.find(
          (r) => r.candidate_id === candidateId && r.internship_id === internship.id
        );

        if (storedRec) {
          return {
            ...internship,
            match: {
              ...computed,
              matchScore: Math.round(storedRec.total_match_score),
              personalizedReason: storedRec.explanation || computed.personalizedReason,
            },
          };
        }

        return {
          ...internship,
          match: computed,
        };
      }).sort((a, b) => {
        if (a.match.isEligible && !b.match.isEligible) return -1;
        if (!a.match.isEligible && b.match.isEligible) return 1;
        return b.match.matchScore - a.match.matchScore;
      });

      return NextResponse.json(matches, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      });
    }

    return NextResponse.json(db.ai_recommendations || []);
  } catch (error) {
    console.error("Error in AI recommendations API:", error);
    return NextResponse.json({ error: "Failed to fetch AI recommendations" }, { status: 500 });
  }
}
