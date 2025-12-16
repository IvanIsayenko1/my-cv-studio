import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { skillsSchema } from "@/types/skills";

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
    SELECT technical, hard, soft, languages
    FROM cv_skills
    WHERE cv_id = ?
    LIMIT 1
    `,
    [cvId]
  );

  if (result.rows.length === 0) {
    // Let the form fall back to its defaultValues
    return NextResponse.json({
      skills: {
        technical: [],
        hard: [],
        soft: [],
        languages: [],
      },
    });
  }

  const row = result.rows[0] as any;

  return NextResponse.json({
    skills: {
      technical: JSON.parse(row.technical as string),
      hard: JSON.parse(row.hard as string),
      soft: JSON.parse(row.soft as string),
      languages: JSON.parse(row.languages as string),
    },
  });
}

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

  const body = await req.json();

  // Validate with Zod
  const parsed = skillsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { skills } = parsed.data;

  // Upsert into cv_skills
  await db.execute(
    `
    INSERT INTO cv_skills (cv_id, technical, hard, soft, languages)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(cv_id) DO UPDATE SET
      technical = excluded.technical,
      hard = excluded.hard,
      soft = excluded.soft,
      languages = excluded.languages
    `,
    [
      cvId,
      JSON.stringify(skills.technical),
      JSON.stringify(skills.hard),
      JSON.stringify(skills.soft),
      JSON.stringify(skills.languages),
    ]
  );

  return NextResponse.json({ success: true });
}
