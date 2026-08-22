export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getDatabase, saveDatabase } from "@/lib/db";
import { verifyPassword, hashPassword } from "@/lib/crypto";

export async function POST(request: Request) {
  try {
    const { userId, email, password, role } = await request.json();
    const db = await getDatabase();

    let user = null;
    if (userId) {
      user = db.users.find((u) => u.userId.toLowerCase() === userId.toLowerCase().trim());
    } else if (email) {
      user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    }

    if (user) {
      // Validate password if present in request and stored in user record
      if (password && user.password) {
        const match = verifyPassword(password, user.password);
        if (!match) {
          return NextResponse.json({ error: "Invalid password credentials" }, { status: 401 });
        }
      }
    } else {
      // Auto-register candidate or employer on login if not found in db
      const targetRole = role || (email && email.includes("hr@") ? "company" : "student");
      const newUserId = `usr-${targetRole}-${Date.now().toString().slice(-4)}`;
      user = {
        userId: newUserId,
        name: email ? email.split("@")[0].replace(".", " ").toUpperCase() : "Candidate",
        email: email || "student@avsar.ai",
        password: hashPassword(password || "password123"),
        role: targetRole,
        company_id: targetRole === "company" ? "comp-101" : undefined,
      };

      if (!db.users) db.users = [];
      db.users.push(user);

      if (targetRole === "student") {
        if (!db.profiles) db.profiles = {};
        db.profiles[newUserId] = {
          userId: newUserId,
          name: user.name,
          email: user.email,
          degree: "Bachelor of Technology (B.Tech)",
          college: "Technology Institute",
          graduationYear: 2026,
          cgpa: 8.5,
          skills: ["Python", "SQL", "React", "Data Analytics"],
          interests: ["Software Engineering", "AI/ML"],
          preferredDomains: ["IT / Software Development"],
          preferredLocations: ["Ahmedabad", "Remote"],
        };
      }

      await saveDatabase(db);
    }

    const profile = user.role === "student" ? db.profiles[user.userId] || null : null;
    const company = user.role === "company" ? (db.companies || []).find((c) => c.company_id === user.company_id) || null : null;

    return NextResponse.json({
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      profile,
      company,
    });
  } catch (error) {
    console.error("Error in POST /api/auth/login:", error);
    return NextResponse.json({ error: "Failed to process login request" }, { status: 500 });
  }
}
