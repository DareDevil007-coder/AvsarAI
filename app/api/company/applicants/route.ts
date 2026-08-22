import { NextResponse } from "next/server";
import { getDatabase, saveDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    const opportunityId = searchParams.get("opportunityId");

    const db = await getDatabase();

    // Find company opportunities
    const companyOppIds = (db.opportunities || [])
      .filter((o) => !companyId || o.company_id === companyId)
      .map((o) => o.id);

    let applications = db.applications.filter((app) => 
      companyOppIds.includes(app.internshipId) ||
      (opportunityId && app.internshipId === opportunityId)
    );

    // Enrich applications with student profile and opportunity details
    const enriched = applications.map((app) => {
      const studentProfile = db.profiles[app.userId] || null;
      const opportunity = (db.opportunities || []).find((o) => o.id === app.internshipId) ||
                          db.internships.find((i) => i.id === app.internshipId);

      return {
        ...app,
        studentProfile,
        opportunity,
      };
    });

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("Error in company applicants GET:", error);
    return NextResponse.json({ error: "Failed to fetch applicants" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { userId, internshipId, status, remarks } = await request.json();

    if (!userId || !internshipId || !status) {
      return NextResponse.json({ error: "userId, internshipId, and status are required" }, { status: 400 });
    }

    const db = await getDatabase();
    const appIndex = db.applications.findIndex(
      (a) => a.userId === userId && a.internshipId === internshipId
    );

    if (appIndex === -1) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const opportunity = (db.opportunities || []).find((o) => o.id === internshipId) ||
                        db.internships.find((i) => i.id === internshipId);
    const oppTitle = opportunity ? opportunity.title : "Internship Position";

    // Update application stage
    db.applications[appIndex] = {
      ...db.applications[appIndex],
      status: status,
      remarks: remarks || db.applications[appIndex].remarks,
      updatedAt: new Date().toISOString(),
    };

    // Auto-generate notification for student
    if (!db.notifications) db.notifications = [];
    db.notifications.unshift({
      notification_id: `notif-${Date.now()}`,
      userId: userId,
      title: `Application Status Updated: ${status}`,
      message: `Your application for "${oppTitle}" has been updated to "${status}". ${remarks ? `Company remarks: ${remarks}` : ""}`,
      createdAt: new Date().toISOString(),
      isRead: false,
      type: "application_update",
    });

    await saveDatabase(db);
    return NextResponse.json({
      application: db.applications[appIndex],
      message: "Application stage updated and student notified.",
    });
  } catch (error) {
    console.error("Error in company applicants PUT:", error);
    return NextResponse.json({ error: "Failed to update application stage" }, { status: 500 });
  }
}
