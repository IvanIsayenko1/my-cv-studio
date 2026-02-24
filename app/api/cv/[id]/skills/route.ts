import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db/client";
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

  const result = await db.execute(
    `
    SELECT coreCompetencies, toolsAndTechnologies, systemsAndMethodologies, collaborationAndDelivery, languages
    FROM cv_skills
    WHERE cv_id = ?
    LIMIT 1
    `,
    [cvId]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({
      skills: {
        categories: [{ name: "Core Skills", items: [""] }],
        languages: [],
      },
    });
  }

  const row = result.rows[0] as {
    coreCompetencies?: string | null;
    toolsAndTechnologies?: string | null;
    systemsAndMethodologies?: string | null;
    collaborationAndDelivery?: string | null;
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

  const { skills } = parsed.data;
  const serialized = serializeSkillsForStorage(skills);

  // Upsert into cv_skills
  await db.execute(
    `
    INSERT INTO cv_skills (cv_id, coreCompetencies, toolsAndTechnologies, systemsAndMethodologies, collaborationAndDelivery, languages)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(cv_id) DO UPDATE SET
      coreCompetencies = excluded.coreCompetencies,
      toolsAndTechnologies = excluded.toolsAndTechnologies,
      systemsAndMethodologies = excluded.systemsAndMethodologies,
      collaborationAndDelivery = excluded.collaborationAndDelivery,
      languages = excluded.languages
    `,
    [
      cvId,
      serialized.coreCompetencies,
      serialized.toolsAndTechnologies,
      serialized.systemsAndMethodologies,
      serialized.collaborationAndDelivery,
      serialized.languages,
    ]
  );

  return NextResponse.json({ success: true });
}
