import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";

import { PRESET_COLORS } from "@/lib/constants/template-accent-colors";
import { db } from "@/lib/db/client";

import { TemplateId } from "@/types/template";

export async function GET(_req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await db.execute(
    `
    SELECT
    c.id,
    c.user_id,
    c.title,
    c.created_at,
    c.updated_at,
    ct.template_id
  FROM cvs c
  LEFT JOIN cv_template ct
    ON ct.cv_id = c.id
  WHERE c.user_id = ?
  ORDER BY c.created_at DESC
    `,
    [userId]
  );

  const cvs = result.rows.map((row: any) => ({
    id: row.id as string,
    userId: row.user_id as string,
    title: row.title as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    templateId: row.template_id as string | null,
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

  // Insert the new CV into the database
  await db.execute({
    sql: `
      INSERT INTO cvs (id, user_id, title)
      VALUES (?, ?, ?)
    `,
    args: [id, userId, title || "Untitled CV"],
  });

  // Insert the default template association for the new CV
  await db.execute({
    sql: `
      INSERT INTO cv_template (cv_id, template_id)
      VALUES (?, ?)
    `,
    args: [id, TemplateId.ATS_FRIENDLY_SIMPLE],
  });

  // Insert the default template config for the new CV
  await db.execute({
    sql: `
       INSERT INTO cv_template_config (cv_id, accent_color, custom_accent_color, template_id)
       VALUES (?, ?, ?, ?)
     `,
    args: [id, "#000000", null, TemplateId.ATS_FRIENDLY_SIMPLE],
  });

  return NextResponse.json({
    id: id,
    title: title || "Untitled CV",
  });
}
