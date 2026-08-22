export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getDatabase, saveDatabase, ApplicationRecord } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const db = await getDatabase();
    if (userId) {
      const userApps = db.applications.filter((app) => app.userId === userId);
      return NextResponse.json(userApps);
    }

    return NextResponse.json(db.applications);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, internshipId } = await request.json();
    if (!userId || !internshipId) {
      return NextResponse.json({ error: "userId and internshipId are required" }, { status: 400 });
    }

    const db = await getDatabase();
    const existing = db.applications.find(
      (app) => app.userId === userId && app.internshipId === internshipId
    );

    if (existing) {
      return NextResponse.json(existing);
    }

    const newApp: ApplicationRecord = {
      userId,
      internshipId,
      appliedAt: new Date().toISOString(),
      status: "Applied",
    };

    db.applications.unshift(newApp);
    await saveDatabase(db);

    return NextResponse.json(newApp, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
