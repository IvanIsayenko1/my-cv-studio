// @ts-ignore
import PDFDocument from "pdfkit";

import { CV } from "@/types/cv";

const COLORS = {
  primary: "#111111",
  secondary: "#555555",
};

const TYPO = {
  name: { font: "Helvetica-Bold", size: 24 },
  title: { font: "Helvetica", size: 12 },
  section: { font: "Helvetica-Bold", size: 11.5 },
  body: { font: "Helvetica", size: 10.5 },
  small: { font: "Helvetica", size: 9.5 },
};

const RHYTHM = {
  sectionGap: 14,
  sectionTitleGap: 6,
  blockGap: 8,
  tightGap: 3,
};

function applyStyle(doc: any, style: any) {
  doc.font(style.font).fontSize(style.size);
}

function addSection(doc: any, title: string) {
  doc.y += RHYTHM.sectionGap;

  applyStyle(doc, TYPO.section);
  doc.fillColor(COLORS.primary).text(title.toUpperCase());

  doc.y += RHYTHM.sectionTitleGap;
}

function renderBulletList(doc: any, items: string[]) {
  if (!items?.length) return;

  applyStyle(doc, TYPO.body);
  doc.fillColor(COLORS.primary);

  doc.list(items, {
    bulletRadius: 2,
    textIndent: 12,
    bulletIndent: 4,
    lineGap: 2,
  });

  doc.y += RHYTHM.tightGap;
}

function formatATSDate(dateStr?: string): string {
  if (!dateStr || dateStr === "Present") return dateStr || "";
  const match = dateStr.match(/(\d{1,2})[\/-](\d{4})/);
  return match ? `${match[1].padStart(2, "0")}/${match[2]}` : dateStr;
}

export function generateATSCleanCV(cv: CV): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margin: 72,
      size: "A4",
    });

    doc.lineGap(1.5);

    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    /* =======================
       HEADER
       ======================= */

    const fullName = `${cv.personalInfo.firstName} ${cv.personalInfo.lastName}`;

    applyStyle(doc, TYPO.name);
    doc.fillColor(COLORS.primary).text(fullName);

    if (cv.personalInfo.professionalTitle) {
      applyStyle(doc, TYPO.title);
      doc.fillColor(COLORS.secondary).text(cv.personalInfo.professionalTitle);
    }

    doc.y += RHYTHM.tightGap;

    const contactLine = [
      cv.personalInfo.email,
      cv.personalInfo.phone,
      `${cv.personalInfo.city}, ${cv.personalInfo.country}`,
      cv.personalInfo.linkedIn,
      cv.personalInfo.portfolio,
    ]
      .filter(Boolean)
      .join(" | ");

    applyStyle(doc, TYPO.small);
    doc.fillColor(COLORS.primary).text(contactLine);

    /* =======================
       PROFESSIONAL SUMMARY
       ======================= */

    if (cv.professionalSummary) {
      addSection(doc, "Professional Summary");

      applyStyle(doc, TYPO.body);
      doc.fillColor(COLORS.primary).text(cv.professionalSummary);
    }

    /* =======================
       SKILLS
       ======================= */

    if (cv.skills) {
      addSection(doc, "Skills");

      const renderSkillCategory = (title: string, values?: string[]) => {
        if (!values?.length) return;

        applyStyle(doc, TYPO.body);
        doc.fillColor(COLORS.primary).text(title);

        doc.y += RHYTHM.tightGap;

        renderBulletList(doc, values);

        doc.y += RHYTHM.blockGap;
      };

      renderSkillCategory("Core Competencies", cv.skills.coreCompetencies);
      renderSkillCategory(
        "Tools & Technologies",
        cv.skills.toolsAndTechnologies
      );
      renderSkillCategory(
        "Systems & Methodologies",
        cv.skills.systemsAndMethodologies
      );
      renderSkillCategory(
        "Collaboration & Delivery",
        cv.skills.collaborationAndDelivery
      );

      if (cv.skills.languages?.length) {
        applyStyle(doc, TYPO.body);
        doc.fillColor(COLORS.primary).text("Languages");

        doc.y += RHYTHM.tightGap;

        const langs = cv.skills.languages.map(
          (l) => `${l.language} — ${l.proficiency}`
        );

        renderBulletList(doc, langs);
      }
    }

    /* =======================
       WORK EXPERIENCE
       ======================= */

    if (cv.workExperience?.length) {
      addSection(doc, "Work Experience");

      cv.workExperience.forEach((job, index) => {
        if (index !== 0) doc.y += RHYTHM.blockGap;

        const start = formatATSDate(job.startDate);
        const end =
          job.endDate === "Present" ? "Present" : formatATSDate(job.endDate);

        applyStyle(doc, TYPO.body);
        doc.fillColor(COLORS.primary).font("Helvetica-Bold").text(job.jobTitle);

        applyStyle(doc, TYPO.small);
        doc
          .fillColor(COLORS.secondary)
          .text(`${job.company}, ${job.location} | ${start} – ${end}`);

        doc.y += RHYTHM.tightGap;

        renderBulletList(doc, job.achievements ?? []);

        if (job.technologies?.length) {
          applyStyle(doc, TYPO.small);
          doc
            .fillColor(COLORS.secondary)
            .text(`Technologies: ${job.technologies.join(", ")}`);
        }
      });
    }

    /* =======================
       EDUCATION
       ======================= */

    if (cv.education?.length) {
      addSection(doc, "Education");

      cv.education.forEach((edu, index) => {
        if (index !== 0) doc.y += RHYTHM.blockGap;

        applyStyle(doc, TYPO.body);
        doc
          .fillColor(COLORS.primary)
          .font("Helvetica-Bold")
          .text(`${edu.degree} in ${edu.fieldOfStudy}`);

        applyStyle(doc, TYPO.small);
        doc
          .fillColor(COLORS.secondary)
          .text(`${edu.institution} | ${formatATSDate(edu.graduationDate)}`);

        if (edu.gpa || edu.honors) {
          applyStyle(doc, TYPO.small);
          doc
            .fillColor(COLORS.primary)
            .text(
              [edu.gpa && `GPA: ${edu.gpa}`, edu.honors]
                .filter(Boolean)
                .join(" | ")
            );
        }
      });
    }

    /* =======================
       CERTIFICATIONS
       ======================= */

    if (cv.certifications?.length) {
      addSection(doc, "Certifications");

      cv.certifications.forEach((cert) => {
        applyStyle(doc, TYPO.body);
        doc
          .fillColor(COLORS.primary)
          .text(
            `${cert.name} — ${cert.issuingOrg}${
              cert.issueDate ? ` (${formatATSDate(cert.issueDate)})` : ""
            }`
          );
      });
    }

    /* =======================
       PROJECTS
       ======================= */

    if (cv.projects?.length) {
      addSection(doc, "Projects");

      cv.projects.slice(0, 3).forEach((p, index) => {
        if (index !== 0) doc.y += RHYTHM.blockGap;

        applyStyle(doc, TYPO.body);
        doc
          .fillColor(COLORS.primary)
          .font("Helvetica-Bold")
          .text(`${p.name} — ${p.role}`);

        applyStyle(doc, TYPO.small);
        doc
          .fillColor(COLORS.secondary)
          .text(`${formatATSDate(p.startDate)} – ${formatATSDate(p.endDate)}`);

        if (p.url) {
          applyStyle(doc, TYPO.small);
          doc.fillColor(COLORS.secondary).text(p.url);
        }

        if (p.description) {
          doc.y += RHYTHM.tightGap;
          applyStyle(doc, TYPO.body);
          doc.fillColor(COLORS.primary).text(p.description);
        }
      });
    }

    /* =======================
       AWARDS
       ======================= */

    if (cv.awards?.length) {
      addSection(doc, "Awards");

      cv.awards.forEach((award, index) => {
        if (index !== 0) doc.y += RHYTHM.blockGap;

        applyStyle(doc, TYPO.body);
        doc.fillColor(COLORS.primary).font("Helvetica-Bold").text(award.name);

        applyStyle(doc, TYPO.small);
        doc
          .fillColor(COLORS.secondary)
          .text(`${award.issuer} | ${formatATSDate(award.date)}`);

        doc.y += RHYTHM.tightGap;

        const descriptionLines = award.description
          .split("\n")
          .map((l: string) => l.trim())
          .filter(Boolean);

        renderBulletList(doc, descriptionLines);
      });
    }

    doc.end();
  });
}
