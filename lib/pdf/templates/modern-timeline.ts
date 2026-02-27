// @ts-ignore
import PDFDocument from "pdfkit";

import { categoryItemsToList } from "@/lib/utils/skill-items";
import { CV } from "@/types/cv";

const COLORS = {
  primary: "#111827",
  secondary: "#6B7280",
  accent: "#2563EB",
};

const TYPO = {
  name: { font: "Helvetica-Bold", size: 26 },
  title: { font: "Helvetica", size: 13 },
  section: { font: "Helvetica-Bold", size: 12 },
  body: { font: "Helvetica", size: 10.5 },
  small: { font: "Helvetica", size: 9.5 },
};

const RHYTHM = {
  sectionGap: 18,
  blockGap: 12,
  tightGap: 4,
};

function applyStyle(doc: any, style: any) {
  doc.font(style.font).fontSize(style.size);
}

function addSection(doc: any, title: string) {
  doc.y += RHYTHM.sectionGap;
  applyStyle(doc, TYPO.section);
  doc.fillColor(COLORS.accent).text(title.toUpperCase());
  doc.y += 6;
}

function renderTwoColumnBlock(
  doc: any,
  leftRender: () => void,
  rightRender: () => void
) {
  const startY = doc.y;

  const pageWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;

  const leftWidth = pageWidth * 0.32;
  const gap = 20;
  const rightX = doc.page.margins.left + leftWidth + gap;

  // LEFT
  doc.y = startY;
  doc.x = doc.page.margins.left;
  leftRender();
  const leftEndY = doc.y;

  // RIGHT
  doc.y = startY;
  doc.x = rightX;
  rightRender();
  const rightEndY = doc.y;

  // Reset cursor
  doc.x = doc.page.margins.left;
  doc.y = Math.max(leftEndY, rightEndY);
}

function renderBulletList(doc: any, items?: string[]) {
  if (!items?.length) return;

  applyStyle(doc, TYPO.body);
  doc.fillColor(COLORS.primary);

  doc.list(items, {
    bulletRadius: 2,
    textIndent: 12,
    bulletIndent: 4,
    lineGap: 2,
  });
}

export function generateModernTwoColumnCV(cv: CV): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      margin: 72,
      size: "A4",
    });

    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    /* =======================
       HEADER
    ======================= */

    applyStyle(doc, TYPO.name);
    doc
      .fillColor(COLORS.accent)
      .text(`${cv.personalInfo.firstName} ${cv.personalInfo.lastName}`);

    if (cv.personalInfo.professionalTitle) {
      applyStyle(doc, TYPO.title);
      doc.fillColor(COLORS.primary).text(cv.personalInfo.professionalTitle);
    }

    const contact = [
      cv.personalInfo.email,
      cv.personalInfo.phone,
      `${cv.personalInfo.city}, ${cv.personalInfo.country}`,
      cv.personalInfo.linkedIn,
      cv.personalInfo.portfolio,
    ]
      .filter(Boolean)
      .join(" | ");

    doc.y += RHYTHM.tightGap;

    applyStyle(doc, TYPO.small);
    doc.fillColor(COLORS.secondary).text(contact);

    doc
      .moveTo(doc.page.margins.left, doc.y + 8)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y + 8)
      .strokeColor(COLORS.accent)
      .lineWidth(1)
      .stroke();

    /* =======================
       PROFESSIONAL PROFILE
    ======================= */

    if (cv.professionalSummary) {
      addSection(doc, "Professional Profile");

      applyStyle(doc, TYPO.body);
      doc.fillColor(COLORS.primary).text(cv.professionalSummary);
    }

    /* =======================
       SKILLS
    ======================= */

    if (cv.skills) {
      addSection(doc, "Core Skills");

      const renderSkillRow = (label: string, values?: string[]) => {
        if (!values?.length) return;

        renderTwoColumnBlock(
          doc,
          () => {
            applyStyle(doc, TYPO.body);
            doc.fillColor(COLORS.primary).font("Helvetica-Bold").text(label);
          },
          () => {
            applyStyle(doc, TYPO.body);
            doc
              .fillColor(COLORS.primary)
              .font("Helvetica")
              .text(values.join(" • "));
          }
        );

        doc.y += RHYTHM.tightGap;
      };

      (cv.skills.categories ?? []).forEach((category) => {
        renderSkillRow(category.name, categoryItemsToList(category.items));
      });

      if (cv.skills.languages?.length) {
        const langs = cv.skills.languages.map(
          (l) => `${l.language} — ${l.proficiency}`
        );
        renderSkillRow("Languages", langs);
      }
    }

    /* =======================
       EXPERIENCE
    ======================= */

    if (cv.workExperience?.length) {
      addSection(doc, "Professional Experience");

      cv.workExperience.forEach((job, index) => {
        if (index !== 0) doc.y += RHYTHM.blockGap;

        renderTwoColumnBlock(
          doc,
          () => {
            applyStyle(doc, TYPO.body);
            doc
              .fillColor(COLORS.primary)
              .font("Helvetica-Bold")
              .text(job.jobTitle);

            doc
              .font("Helvetica")
              .fillColor(COLORS.secondary)
              .text(`${job.company} — ${job.location}`);

            doc.text(`${job.startDate} – ${job.endDate || "Present"}`);

            doc.text(job.employmentType);
          },
          () => {
            renderBulletList(doc, job.achievements);

            if (job.toolsAndMethods?.length) {
              doc.moveDown(0.5);
              applyStyle(doc, TYPO.small);
              doc
                .fillColor(COLORS.secondary)
                .text(`Tools & Methods: ${job.toolsAndMethods.join(", ")}`);
            }
          }
        );
      });
    }

    /* =======================
       EDUCATION
    ======================= */

    if (cv.education?.length) {
      addSection(doc, "Education");

      cv.education.forEach((edu, index) => {
        if (index !== 0) doc.y += RHYTHM.blockGap;

        renderTwoColumnBlock(
          doc,
          () => {
            applyStyle(doc, TYPO.body);
            doc
              .fillColor(COLORS.primary)
              .font("Helvetica-Bold")
              .text(`${edu.degree} in ${edu.fieldOfStudy}`);

            doc
              .font("Helvetica")
              .fillColor(COLORS.secondary)
              .text(edu.institution);

            doc.text(edu.location);
            doc.text(edu.graduationDate);
          },
          () => {
            if (edu.grade || edu.gradingScale || edu.honors) {
              applyStyle(doc, TYPO.small);
              doc
                .fillColor(COLORS.primary)
                .text(
                  [
                    edu.grade &&
                      `Grade: ${edu.grade}${
                        edu.gradingScale ? ` (${edu.gradingScale})` : ""
                      }`,
                    edu.honors,
                  ]
                    .filter(Boolean)
                    .join(" | ")
                );
            }
          }
        );
      });
    }

    /* =======================
       CERTIFICATIONS
    ======================= */

    if (cv.certifications?.length) {
      addSection(doc, "Certifications");

      cv.certifications.forEach((cert, index) => {
        if (index !== 0) doc.y += RHYTHM.blockGap;

        renderTwoColumnBlock(
          doc,
          () => {
            applyStyle(doc, TYPO.body);
            doc
              .fillColor(COLORS.primary)
              .font("Helvetica-Bold")
              .text(cert.name);

            doc
              .font("Helvetica")
              .fillColor(COLORS.secondary)
              .text(cert.issuingOrg);

            doc.text(
              `Issued: ${cert.issueDate}${
                cert.expirationDate ? ` | Expires: ${cert.expirationDate}` : ""
              }`
            );
          },
          () => {
            if (cert.credentialId) {
              applyStyle(doc, TYPO.small);
              doc
                .fillColor(COLORS.primary)
                .text(`Credential ID: ${cert.credentialId}`);
            }
          }
        );
      });
    }

    /* =======================
       PROJECTS
    ======================= */

    if (cv.projects?.length) {
      addSection(doc, "Projects");

      cv.projects.forEach((p, index) => {
        if (index !== 0) doc.y += RHYTHM.blockGap;

        renderTwoColumnBlock(
          doc,
          () => {
            applyStyle(doc, TYPO.body);
            doc.fillColor(COLORS.primary).font("Helvetica-Bold").text(p.name);

            doc.font("Helvetica").fillColor(COLORS.secondary).text(`${p.role}`);

            doc.text(`${p.startDate} – ${p.endDate}`);

            if (p.url) doc.text(p.url);
          },
          () => {
            applyStyle(doc, TYPO.body);
            doc.fillColor(COLORS.primary).text(p.description);
          }
        );
      });
    }

    /* =======================
       AWARDS
    ======================= */

    if (cv.awards?.length) {
      addSection(doc, "Awards");

      cv.awards.forEach((award, index) => {
        if (index !== 0) doc.y += RHYTHM.blockGap;

        renderTwoColumnBlock(
          doc,
          () => {
            applyStyle(doc, TYPO.body);
            doc
              .fillColor(COLORS.primary)
              .font("Helvetica-Bold")
              .text(award.name);

            doc
              .font("Helvetica")
              .fillColor(COLORS.secondary)
              .text(award.issuer);

            doc.text(award.date);
          },
          () => {
            applyStyle(doc, TYPO.body);
            doc.fillColor(COLORS.primary).text(award.description);
          }
        );
      });
    }

    doc.end();
  });
}
