import { NextResponse } from "next/server";
import { getDatabase, saveDatabase, InterviewRecord } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    const userId = searchParams.get("userId");

    const db = await getDatabase();
    let list = db.interviews || [];

    if (companyId) {
      list = list.filter((i) => i.company_id === companyId);
    }
    if (userId) {
      list = list.filter((i) => i.userId === userId);
    }

    return NextResponse.json(list);
  } catch (error) {
    console.error("Error in company interviews GET:", error);
    return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const interviewData: Partial<InterviewRecord> = await request.json();

    if (!interviewData.userId || !interviewData.internshipId) {
      return NextResponse.json({ error: "userId and internshipId are required" }, { status: 400 });
    }

    const db = await getDatabase();

    const newInterview: InterviewRecord = {
      interview_id: `intv-${Date.now()}`,
      application_id: interviewData.application_id || `app-${Date.now()}`,
      userId: interviewData.userId,
      internshipId: interviewData.internshipId,
      company_id: interviewData.company_id || "CO001",
      scheduledAt: interviewData.scheduledAt || new Date(Date.now() + 86400000).toISOString(),
      mode: interviewData.mode || "Online",
      meetingLinkOrVenue: interviewData.meetingLinkOrVenue || "https://meet.google.com/avsar-interview",
      notes: interviewData.notes || "Technical interview round",
      status: "Scheduled",
    };

    if (!db.interviews) db.interviews = [];
    db.interviews.unshift(newInterview);

    // Update application stage to 'Interview'
    const appIndex = db.applications.findIndex(
      (a) => a.userId === interviewData.userId && a.internshipId === interviewData.internshipId
    );
    if (appIndex !== -1) {
      db.applications[appIndex].status = "Interview";
    }

    // Auto-generate notification for student
    if (!db.notifications) db.notifications = [];
    db.notifications.unshift({
      notification_id: `notif-${Date.now()}`,
      userId: interviewData.userId,
      title: "Interview Scheduled!",
      message: `An interview has been scheduled for ${new Date(newInterview.scheduledAt).toLocaleString()}. Mode: ${newInterview.mode}. Link/Venue: ${newInterview.meetingLinkOrVenue}`,
      createdAt: new Date().toISOString(),
      isRead: false,
      type: "interview",
    });

    await saveDatabase(db);
    return NextResponse.json(newInterview, { status: 201 });
  } catch (error) {
    console.error("Error in company interviews POST:", error);
    return NextResponse.json({ error: "Failed to schedule interview" }, { status: 500 });
  }
}
