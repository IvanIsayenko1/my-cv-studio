import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db/client";
import {
  normalizeLanguagesFromRow,
  serializeLanguagesForStorage,
} from "@/lib/utils/languages-transform";

import { languagesSchema } from "@/schemas/languages";

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
    SELECT languages
    FROM cv_languages
    WHERE cv_id = ?
    LIMIT 1
    `,
    [cvId]
  );

  const row = result.rows[0] as {
    categorySkills?: string | null;
    languages?: string | null;
  };

  return NextResponse.json(normalizeLanguagesFromRow(row));
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
  const parsed = languagesSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const serialized = serializeLanguagesForStorage(parsed.data);

  // Upsert into cv_languages
  await db.execute(
    `
    INSERT INTO cv_languages (cv_id, languages)
    VALUES (?, ?)
    ON CONFLICT(cv_id) DO UPDATE SET
      languages = excluded.languages
    `,
    [cvId, serialized.languages]
  );

  return NextResponse.json({ success: true });
}
