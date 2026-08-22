import { NextResponse } from "next/server";
import { getDatabase, saveDatabase } from "@/lib/db";
import { parseResumeText } from "@/lib/resumeParser";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, fileName, fileSize, fileText } = body;

    const targetUserId = userId || "usr-student-001";
    const resumeText = fileText || `Sample resume text for ${fileName || "candidate"}. Experienced in Python, SQL, React, Data Analytics, AWS Cloud, and Software Testing with CGPA 8.8.`;

    // 1. Analyze and extract skill data from resume
    const parsedData = await parseResumeText(resumeText);

    // 2. Fetch current database
    const db = await getDatabase();
    if (!db.profiles) db.profiles = {};

    const currentProfile = db.profiles[targetUserId] || {
      userId: targetUserId,
      name: "",
      email: "",
      degree: "Bachelor of Technology (B.Tech - Computer Science)",
      college: "Gujarat Technological University",
      graduationYear: 2026,
      cgpa: 8.5,
      skills: ["Python", "SQL"],
      interests: ["Software Engineering", "AI/ML"],
      preferredDomains: ["IT / Software Development"],
      preferredLocations: ["Ahmedabad", "Remote"],
    };

    // Merge extracted skills cleanly without duplicating
    const mergedSkills = Array.from(new Set([
      ...(currentProfile.skills || []),
      ...parsedData.extractedSkills,
    ]));

    // Update candidate profile with resume metadata and extracted skills
    const updatedProfile = {
      ...currentProfile,
      skills: mergedSkills,
      resumeFileName: fileName || "resume.pdf",
      resumeFileSize: fileSize || "1.2 MB",
      resumeUploadedAt: new Date().toISOString(),
      cgpa: parsedData.suggestedCgpa || currentProfile.cgpa || 8.5,
    };

    db.profiles[targetUserId] = updatedProfile;
    await saveDatabase(db);

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      extractedSkills: parsedData.extractedSkills,
      extractedCount: parsedData.extractedSkills.length,
      message: `Resume successfully analyzed! ${parsedData.extractedSkills.length} skills extracted and merged.`,
    });
  } catch (error) {
    console.error("Error in POST /api/profile/upload-resume:", error);
    return NextResponse.json({ error: "Failed to parse and update resume" }, { status: 500 });
  }
}
