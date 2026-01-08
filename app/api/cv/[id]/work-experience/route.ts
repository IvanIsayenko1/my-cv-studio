// app/api/cv/[id]/work-experience/route.ts
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const workExperienceItemSchema = z.object({
  jobTitle: z.string(),
  company: z.string(),
  location: z.string(),
  employmentType: z.enum([
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Internship",
  ]),
  startDate: z.string(),
  endDate: z.string(),
  achievements: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
});

const workExperienceBodySchema = z.object({
  workExperience: z.array(workExperienceItemSchema),
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

  // Ensure CV belongs to user
  const cv = await db.execute(
    "SELECT id FROM cvs WHERE id = ? AND user_id = ? LIMIT 1 ",
    [cvId, ownerId]
  );
  if (cv.rows.length === 0) {
    return NextResponse.json({ error: "CV not found" }, { status: 404 });
  }

  // Fetch roles
  const roles = await db.execute(
    `
    SELECT
      we.id,
      we.job_title,
      we.company,
      we.location,
      we.employment_type,
      we.start_date,
      we.end_date
    FROM cv_work_experience we
    WHERE we.cv_id = ?
    ORDER BY
      substr(start_date, 4, 4) DESC,  -- year
      substr(start_date, 1, 2) DESC;  -- month
    `,
    [cvId]
  );

  // Fetch achievements
  const achievements = await db.execute(
    `
    SELECT work_experience_id, text
    FROM cv_work_experience_achievement
    WHERE work_experience_id IN (
      SELECT id FROM cv_work_experience WHERE cv_id = ?
    )
    ORDER BY rowid
    `,
    [cvId]
  );

  // Fetch technologies
  const technologies = await db.execute(
    `
    SELECT work_experience_id, name
    FROM cv_work_experience_technology
    WHERE work_experience_id IN (
      SELECT id FROM cv_work_experience WHERE cv_id = ?
    )
    ORDER BY rowid
    `,
    [cvId]
  );

  const achievementsByRole = new Map<string, string[]>();
  for (const row of achievements.rows as any[]) {
    const wid = row.work_experience_id as string;
    const list = achievementsByRole.get(wid) ?? [];
    list.push(row.text as string);
    achievementsByRole.set(wid, list);
  }

  const technologiesByRole = new Map<string, string[]>();
  for (const row of technologies.rows as any[]) {
    const wid = row.work_experience_id as string;
    const list = technologiesByRole.get(wid) ?? [];
    list.push(row.name as string);
    technologiesByRole.set(wid, list);
  }

  const workExperience = (roles.rows as any[]).map((row) => ({
    jobTitle: row.job_title as string,
    company: row.company as string,
    location: row.location as string,
    employmentType: row.employment_type as
      | "Full-time"
      | "Part-time"
      | "Contract"
      | "Freelance"
      | "Internship",
    startDate: row.start_date as string,
    endDate: row.end_date as string,
    achievements: achievementsByRole.get(row.id as string) ?? [],
    technologies: technologiesByRole.get(row.id as string) ?? [],
  }));

  return NextResponse.json({ workExperience });
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

  const json = await req.json();
  const { workExperience } = workExperienceBodySchema.parse(json);

  // Clear existing roles + child rows
  await db.execute(
    "DELETE FROM cv_work_experience_achievement WHERE work_experience_id IN (SELECT id FROM cv_work_experience WHERE cv_id = ?)",
    [cvId]
  );
  await db.execute(
    "DELETE FROM cv_work_experience_technology WHERE work_experience_id IN (SELECT id FROM cv_work_experience WHERE cv_id = ?)",
    [cvId]
  );
  await db.execute("DELETE FROM cv_work_experience WHERE cv_id = ?", [cvId]);

  // Insert new roles
  for (const w of workExperience) {
    const workId = randomUUID();
    await db.execute(
      `
      INSERT INTO cv_work_experience (
        id,
        cv_id,
        job_title,
        company,
        location,
        employment_type,
        start_date,
        end_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        workId,
        cvId,
        w.jobTitle,
        w.company,
        w.location,
        w.employmentType,
        w.startDate,
        w.endDate,
      ]
    );

    for (const text of w.achievements ?? []) {
      await db.execute(
        `
        INSERT INTO cv_work_experience_achievement (
          id,
          work_experience_id,
          text
        ) VALUES (?, ?, ?)
        `,
        [randomUUID(), workId, text]
      );
    }

    for (const name of w.technologies ?? []) {
      await db.execute(
        `
        INSERT INTO cv_work_experience_technology (
          id,
          work_experience_id,
          name
        ) VALUES (?, ?, ?)
        `,
        [randomUUID(), workId, name]
      );
    }
  }

  return NextResponse.json({ success: true });
}
