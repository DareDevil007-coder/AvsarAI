export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDatabase();
    const companies = db.companies || [];

    const skills = db.skills_master && db.skills_master.length > 0
      ? db.skills_master
      : Array.from(new Set(companies.flatMap(c => c.relevant_skills ? c.relevant_skills.split(',').map(s => s.trim()) : [])))
          .filter(Boolean)
          .map((name, idx) => ({ skill_id: idx + 1, skill_name: name, category: 'Technical' }));

    const sectors = db.sectors_master && db.sectors_master.length > 0
      ? db.sectors_master
      : Array.from(new Set(companies.map(c => c.sector)))
          .filter(Boolean)
          .map((name, idx) => ({ sector_id: idx + 1, sector_name: name, description: '' }));

    const districts = db.districts_master && db.districts_master.length > 0
      ? db.districts_master
      : Array.from(new Set(companies.map(c => c.location)))
          .filter(Boolean)
          .map((name, idx) => ({ district_id: idx + 1, state_name: '', district_name: name, is_aspirational: false, tier: 'Tier-1' }));

    return NextResponse.json({
      skills,
      sectors,
      districts,
      companies,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch master schema tables" }, { status: 500 });
  }
}
