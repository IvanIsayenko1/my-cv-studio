// @ts-ignore
import PDFDocument from "pdfkit";

import { categoryItemsToList } from "@/lib/utils/skill-items";
import { CV } from "@/types/cv";

const COLORS = {
  primary: "#0F172A", // near-black
  accent: "#2563EB", // blue accent
  secondary: "#475569", // muted gray
};

const FONTS = {
  name: 28,
  title: 13,
  heading: 12,
  body: 11,
  small: 10,
};

export function generateATSCleanColoredCV(cv: CV): Promise<Buffer> {
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

    const fullName = `${cv.personalInfo.firstName} ${cv.personalInfo.lastName}`;

    doc
      .font("Helvetica-Bold")
      .fontSize(FONTS.name)
      .fillColor(COLORS.primary)
      .text(fullName);

    if (cv.personalInfo.professionalTitle) {
      doc
        .font("Helvetica")
        .fontSize(FONTS.title)
        .fillColor(COLORS.secondary)
        .text(cv.personalInfo.professionalTitle);
    }

    doc.moveDown(0.4);

    const contactLine = [
      cv.personalInfo.email,
      cv.personalInfo.phone,
      `${cv.personalInfo.city}, ${cv.personalInfo.country}`,
      cv.personalInfo.linkedIn,
      cv.personalInfo.portfolio,
    ]
      .filter(Boolean)
      .join(" • ");

    doc
      .font("Helvetica")
      .fontSize(FONTS.small)
      .fillColor(COLORS.primary)
      .text(contactLine);

    doc.moveDown(1);

    /* =======================
       SUMMARY
       ======================= */

    if (cv.professionalSummary) {
      addAccentSection(doc, "Professional Summary");
      doc
        .font("Helvetica")
        .fontSize(FONTS.body)
        .fillColor(COLORS.primary)
        .text(cv.professionalSummary);
    }

    /* =======================
       SKILLS
       ======================= */

    if (cv.skills) {
      addAccentSection(doc, "Skills");

      (cv.skills.categories ?? []).forEach((category) => {
        const skillItems = categoryItemsToList(category.items);
        if (skillItems.length) {
          skillGroup(doc, category.name, skillItems);
        }
      });

      if (cv.skills.languages?.length) {
        const langs = cv.skills.languages
          .map((l) => `${l.language} (${l.proficiency})`)
          .join(", ");

        doc
          .moveDown(0.2)
          .font("Helvetica")
          .fontSize(FONTS.body)
          .fillColor(COLORS.primary)
          .text(`Languages: ${langs}`);
      }
    }

    /* =======================
       WORK EXPERIENCE
       ======================= */

    if (cv.workExperience?.length) {
      addAccentSection(doc, "Work Experience");

      cv.workExperience.forEach((job) => {
        const start = formatATSDate(job.startDate);
        const end =
          job.endDate === "Present" ? "Present" : formatATSDate(job.endDate);

        doc
          .font("Helvetica-Bold")
          .fontSize(FONTS.body)
          .fillColor(COLORS.primary)
          .text(job.jobTitle);

        doc
          .font("Helvetica")
          .fontSize(FONTS.small)
          .fillColor(COLORS.secondary)
          .text(`${job.company}, ${job.location} | ${start} – ${end}`);

        doc.moveDown(0.25);

        job.achievements?.forEach((a) => {
          doc
            .font("Helvetica")
            .fontSize(FONTS.body)
            .fillColor(COLORS.primary)
            .text(`- ${a}`);
        });

        if (job.toolsAndMethods?.length) {
          doc
            .moveDown(0.2)
            .fontSize(FONTS.small)
            .fillColor(COLORS.secondary)
            .text(`Tools & Methods: ${job.toolsAndMethods.join(", ")}`);
        }

        doc.moveDown(0.8);
      });
    }

    /* =======================
       EDUCATION
       ======================= */

    if (cv.education?.length) {
      addAccentSection(doc, "Education");

      cv.education.forEach((edu) => {
        doc
          .font("Helvetica-Bold")
          .fontSize(FONTS.body)
          .fillColor(COLORS.primary)
          .text(`${edu.degree} in ${edu.fieldOfStudy}`);

        doc
          .font("Helvetica")
          .fontSize(FONTS.small)
          .fillColor(COLORS.secondary)
          .text(`${edu.institution} | ${formatATSDate(edu.graduationDate)}`);

        if (edu.grade || edu.gradingScale || edu.honors) {
          doc
            .fontSize(FONTS.small)
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

        doc.moveDown(0.6);
      });
    }

    /* =======================
       CERTIFICATIONS
       ======================= */

    if (cv.certifications?.length) {
      addAccentSection(doc, "Certifications");

      cv.certifications.forEach((cert) => {
        const dates = [];
        if (cert.issueDate) dates.push(formatATSDate(cert.issueDate));
        if (cert.expirationDate) dates.push(formatATSDate(cert.expirationDate));

        doc
          .font("Helvetica")
          .fontSize(FONTS.body)
          .fillColor(COLORS.primary)
          .text(
            `${cert.name} – ${cert.issuingOrg}${
              dates.length ? ` (${dates.join(" – ")})` : ""
            }`
          );
      });
    }

    /* =======================
       PROJECTS
       ======================= */

    if (cv.projects?.length) {
      addAccentSection(doc, "Projects");

      cv.projects.slice(0, 3).forEach((p) => {
        doc
          .font("Helvetica-Bold")
          .fontSize(FONTS.body)
          .fillColor(COLORS.primary)
          .text(`${p.name} – ${p.role}`);

        doc
          .font("Helvetica")
          .fontSize(FONTS.small)
          .fillColor(COLORS.secondary)
          .text(`${formatATSDate(p.startDate)} – ${formatATSDate(p.endDate)}`);

        if (p.url) {
          doc
            .font("Helvetica")
            .fontSize(FONTS.small)
            .fillColor(COLORS.primary)
            .text(p.url);
        }

        if (p.description) {
          doc
            .moveDown(0.1)
            .fontSize(FONTS.body)
            .fillColor(COLORS.primary)
            .text(p.description);
        }

        doc.moveDown(0.7);
      });
    }

    doc.end();
  });
}

/* =======================
   HELPERS
   ======================= */

function addAccentSection(doc: any, title: string) {
  doc.moveDown(1);
  doc
    .font("Helvetica-Bold")
    .fontSize(FONTS.heading)
    .fillColor(COLORS.accent)
    .text(title.toUpperCase());
  doc.moveDown(0.4);
}

function skillGroup(doc: any, label: string, skills: string[]) {
  doc.font("Helvetica-Bold").fontSize(11).fillColor(COLORS.primary).text(label);
  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor(COLORS.secondary)
    .text(skills.join(", "));
  doc.moveDown(0.3);
}

function formatATSDate(dateStr: string): string {
  if (!dateStr || dateStr === "Present") return dateStr;
  const match = dateStr.match(/(\d{1,2})[\/-](\d{4})/);
  return match ? `${match[1].padStart(2, "0")}/${match[2]}` : dateStr;
}
