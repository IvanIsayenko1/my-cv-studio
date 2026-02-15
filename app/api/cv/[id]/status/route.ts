import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

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

  const statusResult = await db.execute(
    `
    SELECT
      EXISTS(SELECT 1 FROM cv_personal_info WHERE cv_id = ?) AS has_personal_info,
      EXISTS(SELECT 1 FROM cv_summary WHERE cv_id = ?) AS has_summary,
      EXISTS(SELECT 1 FROM cv_skills WHERE cv_id = ?) AS has_skills,
      EXISTS(SELECT 1 FROM cv_work_experience WHERE cv_id = ?) AS has_experience,
      EXISTS(SELECT 1 FROM cv_education WHERE cv_id = ?) AS has_education
    `,
    [cvId, cvId, cvId, cvId, cvId]
  );

  const row: any = statusResult.rows[0];

  const hasPersonalInfo = Boolean(row.has_personal_info);
  const hasSummary = Boolean(row.has_summary);
  const hasSkills = Boolean(row.has_skills);
  const hasExperience = Boolean(row.has_experience);
  const hasEducation = Boolean(row.has_education);

  const missing: string[] = [];

  if (!hasPersonalInfo) missing.push("personal_info");
  if (!hasSummary) missing.push("summary");
  if (!hasSkills) missing.push("skills");
  if (!hasExperience) missing.push("work_experience");
  if (!hasEducation) missing.push("education");

  const canDownload = missing.length === 0;

  return NextResponse.json({
    isReady: canDownload,
  });
}
