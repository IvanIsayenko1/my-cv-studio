import { parseEducationMeta } from "@/lib/utils/education-grade-transform";
import { normalizeLanguagesFromRow } from "@/lib/utils/languages-transform";
import { parseProfessionalLinksFromStorage } from "@/lib/utils/personal-links-transform";
import { normalizeSkillsFromRow } from "@/lib/utils/skills-transform";

import { CV } from "@/types/cv";
import { TemplateId } from "@/types/template";

import { db } from "./client";
import { ShareRecord, getActiveShareByToken } from "./share";

export async function getCompleteCV(cvId: string): Promise<CV | null> {
  const cvMeta = await db.execute(
    "SELECT id, user_id, title, created_at, updated_at FROM cvs WHERE id = ? LIMIT 1",
    [cvId]
  );
  if (cvMeta.rows.length === 0) return null;
  const cvRow = cvMeta.rows[0] as any;

  const [
    personal,
    summary,
    skillsRow,
    languagesRow,
    workExpRows,
    educationRows,
    certificationRows,
    projectRows,
    awardRows,
    achievementRows,
    technologyRows,
    templateRows,
    templateConfigRows,
  ] = await Promise.all([
    db.execute("SELECT * FROM cv_personal_info WHERE cv_id = ? LIMIT 1", [
      cvId,
    ]),
    db.execute(
      "SELECT professional_summary FROM cv_summary WHERE cv_id = ? LIMIT 1",
      [cvId]
    ),
    db.execute("SELECT categorySkills FROM cv_skills WHERE cv_id = ? LIMIT 1", [
      cvId,
    ]),
    db.execute("SELECT languages FROM cv_languages WHERE cv_id = ? LIMIT 1", [
      cvId,
    ]),

    // Work Experience - Proper MM/YYYY sorting
    db.execute(
      `SELECT id, job_title, company, location, employment_type, start_date, end_date
       FROM cv_work_experience 
       WHERE cv_id = ?
       ORDER BY 
         substr(start_date, 4, 4) DESC,  -- year
         substr(start_date, 1, 2) DESC   -- month
       `,
      [cvId]
    ),

    // Education - Proper MM/YYYY sorting
    db.execute(
      `SELECT degree, field_of_study, institution, location, graduation_date, gpa, honors
       FROM cv_education 
       WHERE cv_id = ?
       ORDER BY 
         substr(graduation_date, 4, 4) DESC,
         substr(graduation_date, 1, 2) DESC
       `,
      [cvId]
    ),

    // Certifications - Proper MM/YYYY sorting
    db.execute(
      `SELECT name, issuing_org, issue_date, expiration_date, credential_id
       FROM cv_certifications 
       WHERE cv_id = ?
       ORDER BY 
         substr(issue_date, 4, 4) DESC,
         substr(issue_date, 1, 2) DESC
       `,
      [cvId]
    ),

    // Projects - Proper MM/YYYY sorting
    db.execute(
      `SELECT name, role, start_date, end_date, description, url
       FROM cv_projects 
       WHERE cv_id = ?
       ORDER BY 
         substr(start_date, 4, 4) DESC,
         substr(start_date, 1, 2) DESC
       `,
      [cvId]
    ),

    // Awards - Proper MM/YYYY sorting
    db.execute(
      `SELECT name, issuer, date, description 
       FROM cv_awards 
       WHERE cv_id = ?
       ORDER BY 
         substr(date, 4, 4) DESC,
         substr(date, 1, 2) DESC
       `,
      [cvId]
    ),

    db.execute(
      `SELECT id, work_experience_id, text FROM cv_work_experience_achievement
       WHERE work_experience_id IN (SELECT id FROM cv_work_experience WHERE cv_id = ?)`,
      [cvId]
    ),
    db.execute(
      `SELECT id, work_experience_id, name FROM cv_work_experience_technology
       WHERE work_experience_id IN (SELECT id FROM cv_work_experience WHERE cv_id = ?)`,
      [cvId]
    ),
    db.execute(
      `SELECT template_id FROM cv_template
       WHERE cv_id = ? LIMIT 1`,
      [cvId]
    ),
    db.execute(
      `SELECT accent_color, custom_accent_color FROM cv_template_config
       WHERE cv_id = ? LIMIT 1`,
      [cvId]
    ),
  ]);

  // Personal info, summary, skills, achievementsByWorkId, technologiesByWorkId
  // ... (same as before - no changes needed)
  const p = (personal.rows[0] || {}) as any;
  const personalInfo: CV["personalInfo"] = {
    firstName: p.first_name || "",
    lastName: p.last_name || "",
    professionalTitle: p.professional_title || "",
    email: p.email || "",
    phone: p.phone || "",
    city: p.city || "",
    country: p.country || "",
    professionalLinks: parseProfessionalLinksFromStorage({
      linkedIn: p.linkedin || "",
      portfolio: p.portfolio || "",
    }),
    linkedIn: p.linkedin || "",
    portfolio: p.portfolio || "",
    photo: p.photo || "",
  };

  const professionalSummary =
    (summary.rows[0] as any)?.professional_summary || "";

  const s = (skillsRow.rows[0] || {}) as {
    categorySkills?: string | null;
  };
  const skills: CV["skills"] = normalizeSkillsFromRow(s);
  const l = (languagesRow.rows[0] || {}) as {
    languages?: string | null;
  };
  const languages: CV["languages"] = normalizeLanguagesFromRow(l).languages.map(
    (item) => ({
      language: item.language,
      proficiency: item.proficiency,
    })
  );

  const achievementsByWorkId = new Map<string, string[]>();
  (achievementRows.rows as any[]).forEach((row) => {
    const key = row.work_experience_id as string;
    if (!achievementsByWorkId.has(key)) achievementsByWorkId.set(key, []);
    achievementsByWorkId.get(key)!.push(row.text as string);
  });

  const technologiesByWorkId = new Map<string, string[]>();
  (technologyRows.rows as any[]).forEach((row) => {
    const key = row.work_experience_id as string;
    if (!technologiesByWorkId.has(key)) technologiesByWorkId.set(key, []);
    technologiesByWorkId.get(key)!.push(row.name as string);
  });

  // Work experience - DB ORDERED (02/2025 → 07/2019)
  const workExperience: CV["workExperience"] = (workExpRows.rows as any[]).map(
    (row) => {
      const id = row.id as string;
      return {
        jobTitle: row.job_title,
        company: row.company,
        location: row.location,
        employmentType:
          row.employment_type as CV["workExperience"][number]["employmentType"],
        startDate: row.start_date,
        endDate: row.end_date || "Present",
        achievements: (achievementsByWorkId.get(id) ?? []).join("\n"),
        toolsAndMethods: technologiesByWorkId.get(id) || [],
      };
    }
  );

  const education: CV["education"] = (educationRows.rows as any[]).map(
    (row) => ({
      ...parseEducationMeta({
        gpa: row.gpa != null ? Number(row.gpa) : null,
        honors: row.honors || "",
      }),
      degree: row.degree,
      fieldOfStudy: row.field_of_study,
      institution: row.institution,
      location: row.location,
      graduationDate: row.graduation_date,
    })
  );

  const certifications: CV["certifications"] = (
    certificationRows.rows as any[]
  ).map((row) => ({
    name: row.name,
    issuingOrg: row.issuing_org,
    issueDate: row.issue_date,
    expirationDate: row.expiration_date || undefined,
    credentialId: row.credential_id || undefined,
  }));

  const projects: CV["projects"] = (projectRows.rows as any[]).map((row) => ({
    name: row.name,
    role: row.role,
    startDate: row.start_date,
    endDate: row.end_date,
    description: row.description,
    url: row.url || undefined,
  }));

  const awards: CV["awards"] = (awardRows.rows as any[]).map((row) => ({
    name: row.name,
    issuer: row.issuer,
    date: row.date,
    description: row.description,
  }));

  const templateId = (templateRows.rows[0]?.template_id as TemplateId) || "";
  const templateConfig = templateConfigRows.rows[0] as any;

  return {
    cvData: {
      id: cvRow.id,
      userId: cvRow.user_id,
      title: cvRow.title,
      createdAt: cvRow.created_at,
      updatedAt: cvRow.updated_at,
    },
    personalInfo,
    professionalSummary,
    workExperience,
    education,
    skills,
    languages,
    certifications,
    projects,
    awards,
    templateId,
    accentColor: templateConfig?.accent_color,
    customAccentColor: templateConfig?.custom_accent_color,
  };
}

export async function getCVBasicInfoByShareToken(
  token: string
): Promise<ShareRecord | null> {
  const share = await getActiveShareByToken(token);
  if (!share) return null;

  return share;
}
