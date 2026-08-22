import { NextResponse } from "next/server";
import { getDatabase, saveDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    const userId = searchParams.get("userId");

    const db = await getDatabase();

    let targetCompanyId = companyId;

    if (!targetCompanyId && userId) {
      const user = db.users.find((u) => u.userId === userId);
      if (user && user.company_id) {
        targetCompanyId = user.company_id;
      }
    }

    if (!targetCompanyId) {
      // Default to TCS if unspecified for demo
      targetCompanyId = "CO001";
    }

    const company = db.companies.find((c) => c.company_id === targetCompanyId);

    if (!company) {
      return NextResponse.json({ error: "Company profile not found" }, { status: 404 });
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error("Error in company profile GET:", error);
    return NextResponse.json({ error: "Failed to fetch company profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedData = await request.json();
    const { company_id } = updatedData;

    if (!company_id) {
      return NextResponse.json({ error: "company_id is required" }, { status: 400 });
    }

    const db = await getDatabase();
    const index = db.companies.findIndex((c) => c.company_id === company_id);

    if (index === -1) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    db.companies[index] = {
      ...db.companies[index],
      ...updatedData,
    };

    await saveDatabase(db);
    return NextResponse.json(db.companies[index]);
  } catch (error) {
    console.error("Error in company profile PUT:", error);
    return NextResponse.json({ error: "Failed to update company profile" }, { status: 500 });
  }
}
