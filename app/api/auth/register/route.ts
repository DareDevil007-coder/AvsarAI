export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getDatabase, saveDatabase, UserRecord } from "@/lib/db";
import { hashPassword } from "@/lib/crypto";

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    const db = await getDatabase();
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return NextResponse.json({ error: "Account already exists with this email address" }, { status: 409 });
    }

    const hashedPassword = hashPassword(password);
    const userId = `usr-${role || "student"}-${Date.now()}`;

    const newUser: UserRecord = {
      userId,
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role || "student",
    };

    db.users.push(newUser);

    if (newUser.role === "student") {
      if (!db.profiles) db.profiles = {};
      db.profiles[userId] = {
        userId,
        name: newUser.name,
        email: newUser.email,
        degree: "Bachelor of Technology (B.Tech)",
        college: "Technology Institute",
        graduationYear: 2026,
        cgpa: 8.0,
        skills: ["Python", "SQL", "React", "Data Analytics"],
        interests: ["Software Engineering", "AI/ML"],
        preferredDomains: ["IT / Software Development"],
        preferredLocations: ["Remote"],
      };
    }

    await saveDatabase(db);

    return NextResponse.json({
      user: {
        userId: newUser.userId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      profile: db.profiles[userId] || null,
    });
  } catch (error) {
    console.error("Error in POST /api/auth/register:", error);
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}
