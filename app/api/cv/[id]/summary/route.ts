import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";
import z from "zod";

import { db } from "@/lib/db/client";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const cvId = String(id);
  const ownerId = String(userId);

  // Ensure CV belongs to user
  const cvResult = await db.execute(
    "SELECT id FROM cvs WHERE id = ? AND user_id = ? LIMIT 1",
    [cvId, ownerId]
  );

  if (cvResult.rows.length === 0) {
    return NextResponse.json({ error: "CV not found" }, { status: 404 });
  }

  const result = await db.execute(
    `
    SELECT professional_summary
    FROM cv_summary
    WHERE cv_id = ?
    LIMIT 1
    `,
    [cvId]
  );

  if (result.rows.length === 0) {
    return NextResponse.json(null);
  }

  const row: any = result.rows[0];

  return NextResponse.json({
    professionalSummary: row.professional_summary as string,
  });
}

const summarySchema = z.object({
  professionalSummary: z.string().min(1),
});

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const cvId = String(id);
  const ownerId = String(userId);

  // Ensure CV belongs to user
  const cvResult = await db.execute(
    "SELECT id FROM cvs WHERE id = ? AND user_id = ? LIMIT 1",
    [cvId, ownerId]
  );
  if (cvResult.rows.length === 0) {
    return NextResponse.json({ error: "CV not found" }, { status: 404 });
  }

  const body = await req.json();
  const data = summarySchema.parse(body);

  await db.execute(
    `
    INSERT INTO cv_summary (cv_id, professional_summary)
    VALUES (?, ?)
    ON CONFLICT(cv_id) DO UPDATE SET
      professional_summary = excluded.professional_summary
    `,
    [cvId, data.professionalSummary]
  );

  return NextResponse.json({ success: true });
}
