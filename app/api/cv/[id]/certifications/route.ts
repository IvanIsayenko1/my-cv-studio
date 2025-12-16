import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";
import { z } from "zod";

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
      issuing_org,
      issue_date,
      expiration_date,
      credential_id
    FROM cv_certifications
    WHERE cv_id = ?
    ORDER BY issue_date DESC
    `,
    [cvId]
  );

  const certifications = (result.rows as any[]).map((row) => ({
    name: row.name as string,
    issuingOrg: row.issuing_org as string,
    issueDate: row.issue_date as string,
    expirationDate: (row.expiration_date as string | null | undefined) ?? "",
    credentialId: (row.credential_id as string | null | undefined) ?? "",
  }));

  return NextResponse.json({ certifications });
}

const certificationItemSchema = z.object({
  name: z.string(),
  issuingOrg: z.string(),
  issueDate: z.string(),
  expirationDate: z.string().optional(),
  credentialId: z.string().optional(),
});

const certificationsBodySchema = z.object({
  certifications: z.array(certificationItemSchema),
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
  const parsed = certificationsBodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { certifications } = parsed.data;

  // Clear existing rows for this CV
  await db.execute("DELETE FROM cv_certifications WHERE cv_id = ?", [cvId]);

  // Insert all certifications
  for (const cert of certifications) {
    await db.execute(
      `
      INSERT INTO cv_certifications (
        id,
        cv_id,
        name,
        issuing_org,
        issue_date,
        expiration_date,
        credential_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        randomUUID(),
        cvId,
        cert.name,
        cert.issuingOrg,
        cert.issueDate,
        cert.expirationDate || null,
        cert.credentialId || null,
      ]
    );
  }

  return NextResponse.json({ success: true });
}
