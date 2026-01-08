import { db } from "@/lib/db";
import { getCompleteCV } from "@/lib/db-queries/cv-queries";
import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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
  const { id } = await context.params;
  const newRandomId = randomUUID();

  // fetch the existing CV
  const existingCV = await getCompleteCV(id);
  if (!existingCV) {
    return NextResponse.json({ error: "CV not found" }, { status: 404 });
  }

  // insert a new CV with the same data to de database
  const {
    personalInfo,
    professionalSummary,
    skills,
    workExperience,
    education,
    certifications,
    projects,
    awards,
  } = existingCV;

  // cv
  await db.execute({
    sql: `
      INSERT INTO cvs (id, user_id, title, status)
      VALUES (?, ?, ?, ?)
    `,
    args: [newRandomId, userId, title || "Untitled CV", "draft"],
  });

  // personal info
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
      newRandomId,
      personalInfo.firstName,
      personalInfo.lastName,
      personalInfo.professionalTitle,
      personalInfo.email,
      personalInfo.phone,
      personalInfo.city,
      personalInfo.country,
      personalInfo.linkedIn ?? null,
      personalInfo.portfolio ?? null,
      personalInfo.photo ?? null,
    ]
  );

  // professional summary
  await db.execute(
    `
      INSERT INTO cv_summary (cv_id, professional_summary)
      VALUES (?, ?)
      ON CONFLICT(cv_id) DO UPDATE SET
        professional_summary = excluded.professional_summary
      `,
    [newRandomId, professionalSummary]
  );

  // work experience
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
        newRandomId,
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

  // education
  for (const ed of education) {
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
        newRandomId,
        ed.degree,
        ed.fieldOfStudy,
        ed.institution,
        ed.location,
        ed.graduationDate,
        ed.gpa ?? null,
        ed.honors ?? null,
      ]
    );
  }

  // skills
  await db.execute(
    `
    INSERT INTO cv_skills (cv_id, technical, hard, soft, languages)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(cv_id) DO UPDATE SET
      technical = excluded.technical,
      hard = excluded.hard,
      soft = excluded.soft,
      languages = excluded.languages
    `,
    [
      newRandomId,
      JSON.stringify(skills.technical),
      JSON.stringify(skills.hard),
      JSON.stringify(skills.soft),
      JSON.stringify(skills.languages),
    ]
  );

  // certifications
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
        newRandomId,
        cert.name,
        cert.issuingOrg,
        cert.issueDate,
        cert.expirationDate || null,
        cert.credentialId || null,
      ]
    );
  }

  // projects
  for (const project of projects ?? []) {
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
        newRandomId,
        project.name,
        project.role,
        project.startDate,
        project.endDate,
        project.description,
        project.url || null,
      ]
    );
  }

  // awards
  for (const award of awards ?? []) {
    await db.execute(
      `
      INSERT INTO cv_awards (
        id,
        cv_id,
        name,
        issuer,
        date,
        description
      ) VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        randomUUID(),
        newRandomId,
        award.name,
        award.issuer,
        award.date,
        award.description,
      ]
    );
  }

  return NextResponse.json({ success: true });
}
