export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getDatabase, saveDatabase } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updateData = await request.json();
    const db = await getDatabase();

    const index = db.internships.findIndex((item) => item.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Internship not found" }, { status: 404 });
    }

    db.internships[index] = {
      ...db.internships[index],
      ...updateData,
      id,
    };

    await saveDatabase(db);
    return NextResponse.json(db.internships[index]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update internship" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();

    const initialLength = db.internships.length;
    db.internships = db.internships.filter((item) => item.id !== id);

    if (db.internships.length === initialLength) {
      return NextResponse.json({ error: "Internship not found" }, { status: 404 });
    }

    db.applications = db.applications.filter((app) => app.internshipId !== id);

    await saveDatabase(db);
    return NextResponse.json({ success: true, message: "Internship deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete internship" }, { status: 500 });
  }
}
