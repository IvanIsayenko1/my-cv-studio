import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";

import { db } from "@/lib/db/client";
import { getCompleteCV } from "@/lib/db/queries";
import { serializeEducationMeta } from "@/lib/utils/education-grade-transform";
import { serializeLanguagesForStorage } from "@/lib/utils/languages-transform";
import { serializeProfessionalLinksForStorage } from "@/lib/utils/personal-links-transform";
import { serializeSkillsForStorage } from "@/lib/utils/skills-transform";

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
  const tx = await db.transaction("write");

  try {
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
      languages,
      workExperience,
      education,
      certifications,
      projects,
      awards,
    } = existingCV;
    const personalLinksStorage = serializeProfessionalLinksForStorage({
      professionalLinks: personalInfo.professionalLinks ?? [],
      linkedIn: personalInfo.linkedIn ?? "",
      portfolio: personalInfo.portfolio ?? "",
    });

    await tx.execute({
      sql: `
        INSERT INTO cvs (id, user_id, title)
        VALUES (?, ?, ?)
      `,
      args: [newRandomId, userId, title || "Untitled CV"],
    });

    await tx.execute({
      sql: `
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
      args: [
        newRandomId,
        personalInfo.firstName,
        personalInfo.lastName,
        personalInfo.professionalTitle,
        personalInfo.email,
        personalInfo.phone,
        personalInfo.city,
        personalInfo.country,
        personalLinksStorage.linkedIn,
        personalLinksStorage.portfolio,
        personalInfo.photo ?? null,
      ],
    });

    await tx.execute({
      sql: `
        INSERT INTO cv_summary (cv_id, professional_summary)
        VALUES (?, ?)
        ON CONFLICT(cv_id) DO UPDATE SET
          professional_summary = excluded.professional_summary
        `,
      args: [newRandomId, professionalSummary],
    });

    for (const w of workExperience) {
      const workId = randomUUID();
      await tx.execute({
        sql: `
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
        args: [
          workId,
          newRandomId,
          w.jobTitle,
          w.company,
          w.location,
          w.employmentType,
          w.startDate,
          w.endDate,
        ],
      });

      const achievementItems = (w.achievements ?? "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      for (const text of achievementItems) {
        await tx.execute({
          sql: `
          INSERT INTO cv_work_experience_achievement (
            id,
            work_experience_id,
            text
          ) VALUES (?, ?, ?)
          `,
          args: [randomUUID(), workId, text],
        });
      }

      for (const name of w.toolsAndMethods ?? []) {
        await tx.execute({
          sql: `
          INSERT INTO cv_work_experience_technology (
            id,
            work_experience_id,
            name
          ) VALUES (?, ?, ?)
          `,
          args: [randomUUID(), workId, name],
        });
      }
    }

    for (const ed of education) {
      const educationMeta = serializeEducationMeta({
        grade: ed.grade,
        gradingScale: ed.gradingScale,
        honors: ed.honors,
      });
      await tx.execute({
        sql: `
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
        args: [
          randomUUID(),
          newRandomId,
          ed.degree,
          ed.fieldOfStudy,
          ed.institution,
          ed.location,
          ed.graduationDate,
          educationMeta.gpa,
          educationMeta.honors,
        ],
      });
    }

    const serializedSkills = serializeSkillsForStorage(skills);
    await tx.execute({
      sql: `
      INSERT INTO cv_skills (cv_id, categorySkills)
      VALUES (?, ?)
      ON CONFLICT(cv_id) DO UPDATE SET
        categorySkills = excluded.categorySkills
      `,
      args: [newRandomId, serializedSkills.categorySkills],
    });

    const serializedLanguages = serializeLanguagesForStorage({ languages });
    await tx.execute({
      sql: `
      INSERT INTO cv_languages (cv_id, languages)
      VALUES (?, ?)
      ON CONFLICT(cv_id) DO UPDATE SET
        languages = excluded.languages
      `,
      args: [newRandomId, serializedLanguages.languages],
    });

    for (const cert of certifications) {
      await tx.execute({
        sql: `
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
        args: [
          randomUUID(),
          newRandomId,
          cert.name,
          cert.issuingOrg,
          cert.issueDate,
          cert.expirationDate || null,
          cert.credentialId || null,
        ],
      });
    }

    for (const project of projects ?? []) {
      await tx.execute({
        sql: `
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
        args: [
          randomUUID(),
          newRandomId,
          project.name,
          project.role,
          project.startDate,
          project.endDate,
          project.description,
          project.url || null,
        ],
      });
    }

    for (const award of awards ?? []) {
      await tx.execute({
        sql: `
        INSERT INTO cv_awards (
          id,
          cv_id,
          name,
          issuer,
          date,
          description
        ) VALUES (?, ?, ?, ?, ?, ?)
        `,
        args: [
          randomUUID(),
          newRandomId,
          award.name,
          award.issuer,
          award.date,
          award.description,
        ],
      });
    }

    await tx.commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    await tx.rollback();
    throw error;
  } finally {
    tx.close();
  }
}
