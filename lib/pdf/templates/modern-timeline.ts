// @ts-ignore
import PDFDocument from "pdfkit";
import { CV } from "@/types/cv";

const PAGE = {
  width: 595.28,
  margin: 60,
};

const COLORS = {
  primary: "#0F172A",
  secondary: "#475569",
  accent: "#2563EB",
  light: "#CBD5E1",
};

const FONTS = {
  name: 32,
  title: 14,
  section: 14,
  body: 11,
  small: 10,
};

export function generateModernTimelineCV(cv: CV): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: PAGE.margin });

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
        .fillColor(COLORS.accent)
        .text(cv.personalInfo.professionalTitle);
    }

    doc.moveDown(0.4);

    doc
      .font("Helvetica")
      .fontSize(FONTS.small)
      .fillColor(COLORS.secondary)
      .text(
        [
          cv.personalInfo.city && cv.personalInfo.country
            ? `${cv.personalInfo.city}, ${cv.personalInfo.country}`
            : null,
          cv.personalInfo.email,
          cv.personalInfo.phone,
          cv.personalInfo.linkedIn,
          cv.personalInfo.portfolio,
        ]
          .filter(Boolean)
          .join(" • "),
        { width: PAGE.width - PAGE.margin * 2 }
      );

    doc.moveDown(1.2);

    /* =======================
       PROFILE
       ======================= */

    if (cv.professionalSummary) {
      sectionTitle(doc, "Profile");
      doc
        .font("Helvetica")
        .fontSize(FONTS.body)
        .fillColor(COLORS.primary)
        .text(sanitize(cv.professionalSummary));
      doc.moveDown(1);
    }

    /* =======================
       EXPERIENCE (TIMELINE)
       ======================= */

    if (cv.workExperience?.length) {
      sectionTitle(doc, "Experience");

      const timelineX = PAGE.margin + 10;
      const contentX = PAGE.margin + 40;
      const dotPositions: number[] = [];

      cv.workExperience.forEach((job) => {
        const start = formatDate(job.startDate);
        const end =
          job.endDate === "Present" ? "Present" : formatDate(job.endDate);

        const entryStartY = doc.y;
        dotPositions.push(entryStartY + 4);

        doc
          .font("Helvetica-Bold")
          .fontSize(FONTS.body)
          .fillColor(COLORS.primary)
          .text(job.jobTitle, contentX);

        doc
          .font("Helvetica")
          .fontSize(FONTS.small)
          .fillColor(COLORS.secondary)
          .text(
            `${job.company} • ${job.location} • ${start} – ${end}`,
            contentX
          );

        doc.moveDown(0.3);

        job.achievements?.forEach((a) => {
          doc
            .font("Helvetica")
            .fontSize(FONTS.body)
            .fillColor(COLORS.primary)
            .text(`– ${sanitize(a)}`, {
              width: PAGE.width - contentX - PAGE.margin,
            });
          doc.moveDown(0.2);
        });

        if (job.technologies?.length) {
          doc
            .font("Helvetica")
            .fontSize(FONTS.small)
            .fillColor(COLORS.secondary)
            .text(`Tech: ${job.technologies.join(", ")}`, contentX);
        }

        doc.moveDown(1);
      });

      // draw timeline line FIRST
      doc
        .strokeColor(COLORS.light)
        .lineWidth(2)
        .moveTo(timelineX, dotPositions[0])
        .lineTo(timelineX, dotPositions[dotPositions.length - 1])
        .stroke();

      // draw dots LAST (on top of the line)
      dotPositions.forEach((y) => {
        doc.circle(timelineX, y, 5).fill(COLORS.accent);
      });

      doc.moveDown(1);
    }

    /* =======================
       SKILLS
       ======================= */

    if (cv.skills) {
      sectionTitle(doc, "Skills");

      const groups = [
        { label: "Frontend", values: cv.skills.technical },
        { label: "Tools & Practices", values: cv.skills.hard },
        { label: "Professional", values: cv.skills.soft },
      ];

      groups.forEach(({ label, values }) => {
        if (!values?.length) return;

        doc
          .font("Helvetica-Bold")
          .fontSize(FONTS.body)
          .fillColor(COLORS.primary)
          .text(label);

        doc
          .font("Helvetica")
          .fontSize(FONTS.body)
          .fillColor(COLORS.secondary)
          .text(values.join(" • "), {
            width: PAGE.width - PAGE.margin * 2,
          });

        doc.moveDown(0.4);
      });

      if (cv.skills.languages?.length) {
        doc
          .font("Helvetica")
          .fontSize(FONTS.body)
          .fillColor(COLORS.primary)
          .text(
            `Languages: ${cv.skills.languages
              .map((l) => `${l.language} (${l.proficiency})`)
              .join(", ")}`
          );
      }

      doc.moveDown(1);
    }

    /* =======================
       PROJECTS
       ======================= */

    if (cv.projects?.length) {
      sectionTitle(doc, "Projects");

      cv.projects.slice(0, 3).forEach((p) => {
        doc
          .font("Helvetica-Bold")
          .fontSize(FONTS.body)
          .fillColor(COLORS.primary)
          .text(p.name);

        doc
          .font("Helvetica")
          .fontSize(FONTS.small)
          .fillColor(COLORS.secondary)
          .text(
            `${p.role} • ${formatDate(p.startDate)} – ${formatDate(p.endDate)}`
          );

        if (p.url) doc.text(p.url);

        if (p.description) {
          doc
            .moveDown(0.1)
            .fontSize(FONTS.body)
            .fillColor(COLORS.primary)
            .text(sanitize(p.description));
        }

        doc.moveDown(0.8);
      });
    }

    /* =======================
       EDUCATION & CERTS
       ======================= */

    sectionTitle(doc, "Education & Certifications");

    cv.education?.forEach((edu) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(FONTS.body)
        .fillColor(COLORS.primary)
        .text(edu.institution);

      doc
        .font("Helvetica")
        .fontSize(FONTS.small)
        .fillColor(COLORS.secondary)
        .text(
          `${edu.degree} in ${edu.fieldOfStudy} • ${formatDate(
            edu.graduationDate
          )}`
        );

      doc.moveDown(0.4);
    });

    cv.certifications?.forEach((c) => {
      doc
        .font("Helvetica")
        .fontSize(FONTS.body)
        .fillColor(COLORS.primary)
        .text(`${c.name} • ${c.issuingOrg}`);
    });

    doc.end();
  });
}

/* =======================
   HELPERS
   ======================= */

function sectionTitle(doc: any, title: string) {
  doc
    .font("Helvetica-Bold")
    .fontSize(FONTS.section)
    .fillColor(COLORS.accent)
    .text(title.toUpperCase());
  doc.moveDown(0.4);
}

function formatDate(dateStr: string): string {
  if (!dateStr || dateStr === "Present") return dateStr;
  const match = dateStr.match(/(\d{1,2})[\/-](\d{4})/);
  return match ? `${match[1].padStart(2, "0")}/${match[2]}` : dateStr;
}

function sanitize(text: string): string {
  return text
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/[^\x00-\x7F]/g, "");
}
