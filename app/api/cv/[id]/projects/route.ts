import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { projectsSchema } from "@/types/projects";

// GET /api/cv/[id]/projects
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
      name,
      role,
      start_date,
      end_date,
      description,
      url
    FROM cv_projects
    WHERE cv_id = ?
    ORDER BY
      substr(start_date, 4, 4) DESC,  -- year
      substr(start_date, 1, 2) DESC;  -- month
    `,
    [cvId]
  );

  const projects = (result.rows as any[]).map((row) => ({
    name: row.name as string,
    role: row.role as string,
    startDate: row.start_date as string,
    endDate: row.end_date as string,
    description: row.description as string,
    url: (row.url as string | null | undefined) ?? "",
  }));

  return NextResponse.json({ projects });
}

// POST /api/cv/[id]/projects
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
  const parsed = projectsSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const projects = parsed.data.projects ?? [];

  // Clear existing projects for this CV
  await db.execute("DELETE FROM cv_projects WHERE cv_id = ?", [cvId]);

  // Insert all projects
  for (const project of projects) {
    await db.execute(
      `
      INSERT INTO cv_projects (
        id,
        cv_id,
        name,
        role,
        start_date,
        end_date,
        description,
        url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        randomUUID(),
        cvId,
        project.name,
        project.role,
        project.startDate,
        project.endDate,
        project.description,
        project.url || null,
      ]
    );
  }

  return NextResponse.json({ success: true });
}
