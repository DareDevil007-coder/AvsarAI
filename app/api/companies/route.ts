import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase() || "";
    const sector = searchParams.get("sector") || "All";
    const type = searchParams.get("type") || "All";

    const db = await getDatabase();
    let result = db.companies || [];

    if (query) {
      result = result.filter(
        (c) =>
          c.company_name.toLowerCase().includes(query) ||
          c.sector.toLowerCase().includes(query) ||
          c.industry.toLowerCase().includes(query) ||
          c.location.toLowerCase().includes(query) ||
          c.relevant_skills.toLowerCase().includes(query)
      );
    }

    if (sector && sector !== "All") {
      result = result.filter((c) => c.sector.toLowerCase() === sector.toLowerCase());
    }

    if (type && type !== "All") {
      result = result.filter((c) => c.company_type.toLowerCase() === type.toLowerCase());
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}
