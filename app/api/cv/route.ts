import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";
import { auth } from "@clerk/nextjs/server";

// GET /api/cv  -> list all user's CVs
export async function GET(_req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db.execute(
    `
    SELECT id, user_id, title, status, created_at, updated_at
    FROM cvs
    WHERE user_id = ?
    ORDER BY created_at DESC
    `,
    [userId]
  );

  const cvs = result.rows.map((row: any) => ({
    id: row.id as string,
    userId: row.user_id as string,
    title: row.title as string,
    status: row.status as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }));

  return NextResponse.json(cvs);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { title } = body;

  // 1) Check if name exists for this user
  const existing = await db.execute({
    sql: "SELECT 1 FROM cvs WHERE user_id = ? AND title = ? LIMIT 1",
    args: [userId, title],
  });

  if (existing.rows.length > 0) {
    return NextResponse.json({ error: "Name already in use" }, { status: 400 });
  }

  // 2) Insert if free
  const id = randomUUID();

  await db.execute({
    sql: `
      INSERT INTO cvs (id, user_id, title, status)
      VALUES (?, ?, ?, ?)
    `,
    args: [id, userId, title || "Untitled CV", "draft"],
  });

  return NextResponse.json({
    id: id,
    title: title || "Untitled CV",
    status: "draft",
  });
}
