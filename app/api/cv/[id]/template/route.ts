// app/api/cv/[id]/template/route.ts
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

import { db } from "@/lib/db/client";

import type { TemplateFormValues } from "@/types/template";

const templateSchema = z.object({
  id: z.string(),
});

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

  const result = await db.execute(
    `
    SELECT template_id
    FROM cv_template
    WHERE cv_id = ?
    LIMIT 1
    `,
    [cvId]
  );

  if (result.rows.length === 0) {
    // fetchTemplate expects null when nothing stored
    return NextResponse.json(null, { status: 200 });
  }

  const row = result.rows[0] as any;

  const template: TemplateFormValues = {
    id: row.template_id as string,
  };

  return NextResponse.json(template, { status: 200 });
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

  const cv = await db.execute(
    "SELECT id FROM cvs WHERE id = ? AND user_id = ? LIMIT 1",
    [cvId, ownerId]
  );
  if (cv.rows.length === 0) {
    return NextResponse.json({ error: "CV not found" }, { status: 404 });
  }

  const json = await req.json();
  const { id: templateId } = templateSchema.parse(json);

  // upsert: clear existing then insert new
  await db.execute("DELETE FROM cv_template WHERE cv_id = ?", [cvId]);

  await db.execute(
    `
    INSERT INTO cv_template (
      cv_id,
      template_id
    ) VALUES (?, ?)
    `,
    [cvId, templateId]
  );

  return NextResponse.json({ success: true }, { status: 200 });
}
