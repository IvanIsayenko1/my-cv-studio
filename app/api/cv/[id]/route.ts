import { db } from "@/lib/db";
import { getCompleteCV } from "@/lib/db-queries/cv-queries";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const cv = await getCompleteCV(id);

  if (!cv) {
    return NextResponse.json({ error: "CV not found" }, { status: 404 });
  }

  return NextResponse.json(cv);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  // Optional: ownership check
  const existing = await db.execute({
    sql: "SELECT 1 FROM cvs WHERE id = ? AND user_id = ?",
    args: [id, userId],
  });

  if (existing.rows.length === 0) {
    return NextResponse.json({ error: "CV not found" }, { status: 404 });
  }

  // This deletes EVERYTHING if CASCADE is set correctly
  await db.execute({
    sql: "DELETE FROM cvs WHERE id = ?",
    args: [id],
  });

  return NextResponse.json({ success: true });
}
