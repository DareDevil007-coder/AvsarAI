import { NextResponse } from "next/server";
import { getDatabase, saveDatabase } from "@/lib/db";
import { normalizeInternshipRecord } from "@/lib/matching";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase().trim() || "";
    const location = searchParams.get("location");
    const domain = searchParams.get("domain");

    const db = await getDatabase();

    // 1. Gather all potential internship/opportunity collections in database dynamically
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

    // 2. Map and normalize every raw database record to ensure safe field mapping
    const seenIds = new Set<string>();
    let results = rawList
      .map((item) => normalizeInternshipRecord(item))
      .filter((item) => {
        if (!item.id || seenIds.has(item.id)) return false;
        seenIds.add(item.id);
        return true;
      });

    // 3. Search filter
    if (query) {
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.organization.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.domain.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query) ||
          item.requiredSkills.some((s) => s.toLowerCase().includes(query))
      );
    }

    // 4. Location filter (Case-insensitive check for ALL)
    if (location && location.trim().toUpperCase() !== "ALL") {
      results = results.filter((item) => item.location.toLowerCase().includes(location.trim().toLowerCase()));
    }

    // 5. Domain filter (Case-insensitive check for ALL)
    if (domain && domain.trim().toUpperCase() !== "ALL") {
      results = results.filter((item) => item.domain.toLowerCase().includes(domain.trim().toLowerCase()));
    }

    return NextResponse.json(results, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      }
    });
  } catch (error) {
    console.error("Error in GET /api/internships:", error);
    return NextResponse.json({ error: "Failed to fetch internships" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newInternshipData = await request.json();
    const db = await getDatabase();

    const newInternship = {
      ...newInternshipData,
      id: `int-${Date.now()}`,
    };

    if (!db.internships) db.internships = [];
    db.internships.unshift(newInternship);
    await saveDatabase(db);

    return NextResponse.json(newInternship, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/internships:", error);
    return NextResponse.json({ error: "Failed to create internship listing" }, { status: 500 });
  }
}
