import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db/client";
import { ensureCvSkillsCategorySkillsColumn } from "@/lib/db/skills-schema";
import {
  normalizeSkillsFromRow,
  serializeSkillsForStorage,
} from "@/lib/utils/skills-transform";

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

  await ensureCvSkillsCategorySkillsColumn();

  const result = await db.execute(
    `
    SELECT categorySkills, languages
    FROM cv_skills
    WHERE cv_id = ?
    LIMIT 1
    `,
    [cvId]
  );

  const row = result.rows[0] as {
    categorySkills?: string | null;
    languages?: string | null;
  };

  return NextResponse.json(normalizeSkillsFromRow(row));
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

  const serialized = serializeSkillsForStorage(parsed.data);

  await ensureCvSkillsCategorySkillsColumn();

  // Upsert into cv_skills
  await db.execute(
    `
    INSERT INTO cv_skills (cv_id, categorySkills, languages)
    VALUES (?, ?, ?)
    ON CONFLICT(cv_id) DO UPDATE SET
      categorySkills = excluded.categorySkills,
      languages = excluded.languages
    `,
    [
      cvId,
      serialized.categorySkills,
      serialized.languages,
    ]
  );

  return NextResponse.json({ success: true });
}
