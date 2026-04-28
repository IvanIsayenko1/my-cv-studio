// app/api/cv/[id]/template/route.ts
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db/client";

import { TemplateConfigFormValues } from "@/schemas/template-config";

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

  const cv = await db.execute(
    "SELECT id FROM cvs WHERE id = ? AND user_id = ? LIMIT 1",
    [cvId, ownerId]
  );
  if (cv.rows.length === 0) {
    return NextResponse.json({ error: "CV not found" }, { status: 404 });
  }

  let result;
  try {
    result = await db.execute(
      `
      SELECT accent_color, custom_accent_color, sections_config
      FROM cv_template_config
      WHERE cv_id = ? AND template_id = (
        SELECT template_id FROM cv_template WHERE cv_id = ? LIMIT 1
      )
      LIMIT 1
      `,
      [cvId, cvId]
    );
  } catch {
    // Fallback if sections_config column doesn't exist yet
    result = await db.execute(
      `
      SELECT accent_color, custom_accent_color
      FROM cv_template_config
      WHERE cv_id = ? AND template_id = (
        SELECT template_id FROM cv_template WHERE cv_id = ? LIMIT 1
      )
      LIMIT 1
      `,
      [cvId, cvId]
    );
  }

  if (result.rows.length === 0) {
    // fetchTemplate expects null when nothing stored
    return NextResponse.json(null, { status: 200 });
  }

  const row = result.rows[0] as any;

  const template: TemplateConfigFormValues = {
    accentColor: row.accent_color as string | undefined,
    customAccentColor: row.custom_accent_color as string | undefined,
    sections: row.sections_config
      ? JSON.parse(row.sections_config)
      : undefined,
  };

  return NextResponse.json(template, { status: 200 });
}

export async function POST(
  req: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: cvId } = await context.params;
  const ownerId = String(userId);

  const body = await req.json();

  console.log("Received template config update:", {
    cvId,
    accentColor: body.accentColor,
    customAccentColor: body.customAccentColor,
    sections: body.sections,
  });

  // Ensure CV belongs to user
  const cv = await db.execute(
    "SELECT id FROM cvs WHERE id = ? AND user_id = ? LIMIT 1",
    [cvId, ownerId]
  );
  if (cv.rows.length === 0) {
    return NextResponse.json({ error: "CV not found" }, { status: 404 });
  }

  // Ensure CV has an active template
  const templateId = await db.execute(
    "SELECT template_id FROM cv_template WHERE cv_id = ? LIMIT 1",
    [cvId]
  );
  if (templateId.rows.length === 0) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }
  const activeTemplateId = templateId.rows[0].template_id;

  // upsert: clear existing then insert new
  await db.execute(
    "DELETE FROM cv_template_config WHERE cv_id = ? AND template_id = ?",
    [cvId, activeTemplateId]
  );

  const sectionsJson = body.sections ? JSON.stringify(body.sections) : null;

  try {
    await db.execute(
      `
      INSERT INTO cv_template_config (
        cv_id,
        template_id,
        accent_color,
        custom_accent_color,
        sections_config
      ) VALUES (?, ?, ?, ?, ?)
      `,
      [
        cvId,
        activeTemplateId,
        body.accentColor,
        body.customAccentColor ?? null,
        sectionsJson,
      ]
    );
  } catch {
    // Fallback if sections_config column doesn't exist yet
    await db.execute(
      `
      INSERT INTO cv_template_config (
        cv_id,
        template_id,
        accent_color,
        custom_accent_color
      ) VALUES (?, ?, ?, ?)
      `,
      [
        cvId,
        activeTemplateId,
        body.accentColor,
        body.customAccentColor ?? null,
      ]
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
