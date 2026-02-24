import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { z } from "zod";

import { db } from "@/lib/db/client";
import {
  parseEducationMeta,
  serializeEducationMeta,
} from "@/lib/utils/education-grade-transform";

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
      degree,
      field_of_study,
      institution,
      location,
      graduation_date,
      gpa,
      honors
    FROM cv_education
    WHERE cv_id = ?
    ORDER BY graduation_date DESC
    `,
    [cvId]
  );

  const education = (result.rows as any[]).map((row) => ({
    ...parseEducationMeta({
      gpa:
        row.gpa === null || row.gpa === undefined ? null : Number(row.gpa),
      honors: (row.honors as string | null) ?? "",
    }),
    degree: row.degree as string,
    fieldOfStudy: row.field_of_study as string,
    institution: row.institution as string,
    location: row.location as string,
    graduationDate: row.graduation_date as string,
  }));

  return NextResponse.json({ education });
}

const educationItemSchema = z.object({
  degree: z.string(),
  fieldOfStudy: z.string(),
  institution: z.string(),
  location: z.string(),
  graduationDate: z.string(),
  grade: z.string().optional(),
  gradingScale: z.string().optional(),
  honors: z.string().optional(),
});

const educationBodySchema = z.object({
  education: z.array(educationItemSchema),
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
  const cv = await db.execute(
    "SELECT id FROM cvs WHERE id = ? AND user_id = ? LIMIT 1",
    [cvId, ownerId]
  );
  if (cv.rows.length === 0) {
    return NextResponse.json({ error: "CV not found" }, { status: 404 });
  }

  const json = await req.json();
  const { education } = educationBodySchema.parse(json);

  // Clear existing education for this CV
  await db.execute("DELETE FROM cv_education WHERE cv_id = ?", [cvId]);

  // Insert all education entries
  for (const ed of education) {
    const serialized = serializeEducationMeta({
      grade: ed.grade,
      gradingScale: ed.gradingScale,
      honors: ed.honors,
    });
    await db.execute(
      `
      INSERT INTO cv_education (
        id,
        cv_id,
        degree,
        field_of_study,
        institution,
        location,
        graduation_date,
        gpa,
        honors
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        randomUUID(),
        cvId,
        ed.degree,
        ed.fieldOfStudy,
        ed.institution,
        ed.location,
        ed.graduationDate,
        serialized.gpa,
        serialized.honors,
      ]
    );
  }

  return NextResponse.json({ success: true });
}
