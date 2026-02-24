import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db/client";
import {
  parseProfessionalLinksFromStorage,
  serializeProfessionalLinksForStorage,
} from "@/lib/utils/personal-links-transform";
import { personalInfoSchema } from "@/types/personal-info";

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

  // Ensure CV belongs to this user
  const cvResult = await db.execute(
    "SELECT id FROM cvs WHERE id = ? AND user_id = ? LIMIT 1",
    [cvId, ownerId]
  );
  if (cvResult.rows.length === 0) {
    return NextResponse.json({ error: "CV not found" }, { status: 404 });
  }

  // Fetch personal info
  const result = await db.execute(
    `
    SELECT
      first_name,
      last_name,
      professional_title,
      email,
      phone,
      city,
      country,
      linkedin,
      portfolio,
      photo
    FROM cv_personal_info
    WHERE cv_id = ?
    LIMIT 1
    `,
    [cvId]
  );

  if (result.rows.length === 0) {
    // no personal info yet
    return NextResponse.json(null);
  }

  const row: any = result.rows[0];

  return NextResponse.json({
    firstName: row.first_name as string,
    lastName: row.last_name as string,
    professionalTitle: row.professional_title as string,
    email: row.email as string,
    phone: row.phone as string,
    city: row.city as string,
    country: row.country as string,
    professionalLinks: parseProfessionalLinksFromStorage({
      linkedIn: (row.linkedin as string | null) ?? "",
      portfolio: (row.portfolio as string | null) ?? "",
    }),
    linkedIn: (row.linkedin as string | null) ?? "",
    portfolio: (row.portfolio as string | null) ?? "",
    photo: (row.photo as string | null) ?? "",
  });
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: cvId } = await context.params;

  // ensure CV belongs to user
  const cvResult = await db.execute(
    "SELECT id FROM cvs WHERE id = ? AND user_id = ? LIMIT 1",
    [cvId, userId]
  );
  if (cvResult.rows.length === 0) {
    return NextResponse.json({ error: "CV not found" }, { status: 404 });
  }

  const body = await req.json();
  const data = personalInfoSchema.parse(body);
  const linksStorage = serializeProfessionalLinksForStorage(data);

  // upsert by primary key cv_id
  await db.execute(
    `
    INSERT INTO cv_personal_info (
      cv_id,
      first_name,
      last_name,
      professional_title,
      email,
      phone,
      city,
      country,
      linkedin,
      portfolio,
      photo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(cv_id) DO UPDATE SET
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      professional_title = excluded.professional_title,
      email = excluded.email,
      phone = excluded.phone,
      city = excluded.city,
      country = excluded.country,
      linkedin = excluded.linkedin,
      portfolio = excluded.portfolio,
      photo = excluded.photo
    `,
    [
      cvId,
      data.firstName,
      data.lastName,
      data.professionalTitle,
      data.email,
      data.phone,
      data.city,
      data.country,
      linksStorage.linkedIn,
      linksStorage.portfolio,
      data.photo ?? null,
    ]
  );

  return NextResponse.json({ success: true });
}
