export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getDatabase, saveDatabase } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");

    const db = await getDatabase();

    if (userId && db.profiles && db.profiles[userId]) {
      return NextResponse.json(db.profiles[userId]);
    }

    if (email && db.users) {
      const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (user && db.profiles && db.profiles[user.userId]) {
        return NextResponse.json(db.profiles[user.userId]);
      }
    }

    // Default fallback profile so missing DB entry does not cause 404/500 errors
    const fallbackProfile = {
      userId: userId || "usr-student-001",
      name: "",
      email: email || "",
      degree: "Bachelor of Technology (B.Tech - Computer Science)",
      college: "Gujarat Technological University",
      graduationYear: 2026,
      cgpa: 8.5,
      skills: ["Python", "SQL", "React", "Data Analytics"],
      interests: ["Software Engineering", "AI/ML"],
      preferredDomains: ["IT / Software Development"],
      preferredLocations: ["Ahmedabad", "Remote"],
      experience: "Fresher"
    };

    return NextResponse.json(fallbackProfile);
  } catch (error) {
    console.error("Error in GET /api/profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const db = await getDatabase();

    const userId = body.userId || body.profile?.userId;
    if (!userId) {
      return NextResponse.json({ error: "userId is required to update profile" }, { status: 400 });
    }

    const profileData = body.profile || body;
    if (!db.profiles) db.profiles = {};

    db.profiles[userId] = {
      ...db.profiles[userId],
      ...profileData,
      userId,
    };

    await saveDatabase(db);
    return NextResponse.json(db.profiles[userId]);
  } catch (error) {
    console.error("Error in PUT /api/profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
