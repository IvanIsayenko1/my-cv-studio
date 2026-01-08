// app/api/cv/[id]/awards/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";

// You can also import this from "@/types/awards"
const awardItemSchema = z.object({
  name: z.string(),
  issuer: z.string(),
  date: z.string(),
  description: z.string(),
});

const awardsBodySchema = z.object({
  awards: z.array(awardItemSchema).optional(),
});

// GET /api/cv/[id]/awards
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
  const cv = await db.execute(
    "SELECT id FROM cvs WHERE id = ? AND user_id = ? LIMIT 1",
    [cvId, ownerId]
  );
  if (cv.rows.length === 0) {
    return NextResponse.json({ error: "CV not found" }, { status: 404 });
  }

  const result = await db.execute(
    `
    SELECT
      id,
      name,
      issuer,
      date,
      description
    FROM cv_awards
    WHERE cv_id = ?
    ORDER BY 
      substr(date, 4, 4) DESC,  -- year
      substr(date, 1, 2) DESC;  -- month
    `,
    [cvId]
  );

  const awards = (result.rows as any[]).map((row) => ({
    name: row.name as string,
    issuer: row.issuer as string,
    date: row.date as string,
    description: row.description as string,
  }));

  return NextResponse.json({ awards });
}

// POST /api/cv/[id]/awards
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
  const cv = await db.execute(
    "SELECT id FROM cvs WHERE id = ? AND user_id = ? LIMIT 1",
    [cvId, ownerId]
  );
  if (cv.rows.length === 0) {
    return NextResponse.json({ error: "CV not found" }, { status: 404 });
  }

  const json = await req.json();
  const parsed = awardsBodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const awards = parsed.data.awards ?? [];

  // Clear existing awards for this CV
  await db.execute("DELETE FROM cv_awards WHERE cv_id = ?", [cvId]);

  // Insert all awards
  for (const award of awards) {
    await db.execute(
      `
      INSERT INTO cv_awards (
        id,
        cv_id,
        name,
        issuer,
        date,
        description
      ) VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        randomUUID(),
        cvId,
        award.name,
        award.issuer,
        award.date,
        award.description,
      ]
    );
  }

  return NextResponse.json({ success: true });
}
