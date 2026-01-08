// @ts-ignore
import PDFDocument from "pdfkit";
import { CV } from "@/types/cv";

const COLORS = {
  primary: "#111111",
  secondary: "#555555",
};

const FONTS = {
  name: 26,
  title: 13,
  heading: 13,
  body: 11,
  small: 10,
};

export function generateATSCleanCV(cv: CV): Promise<Buffer> {
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
      .join(" | ");

    doc
      .font("Helvetica")
      .fontSize(FONTS.small)
      .fillColor(COLORS.primary)
      .text(contactLine);

    doc.moveDown(1);

    /* =======================
       PROFESSIONAL SUMMARY
       ======================= */

    if (cv.professionalSummary) {
      addSection(doc, "Professional Summary");
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
      addSection(doc, "Skills");

      if (cv.skills.technical?.length) {
        doc
          .font("Helvetica-Bold")
          .fontSize(FONTS.body)
          .text("Technical Skills");
        doc
          .font("Helvetica")
          .fillColor(COLORS.secondary)
          .text(cv.skills.technical.join(", "));
        doc.moveDown(0.3);
      }

      if (cv.skills.hard?.length) {
        doc
          .font("Helvetica-Bold")
          .fillColor(COLORS.primary)
          .text("Tools & Practices");
        doc
          .font("Helvetica")
          .fillColor(COLORS.secondary)
          .text(cv.skills.hard.join(", "));
        doc.moveDown(0.3);
      }

      if (cv.skills.soft?.length) {
        doc
          .font("Helvetica-Bold")
          .fillColor(COLORS.primary)
          .text("Professional Skills");
        doc
          .font("Helvetica")
          .fillColor(COLORS.secondary)
          .text(cv.skills.soft.join(", "));
        doc.moveDown(0.3);
      }

      if (cv.skills.languages?.length) {
        const langs = cv.skills.languages
          .map((l) => `${l.language} (${l.proficiency})`)
          .join(", ");
        doc
          .font("Helvetica")
          .fillColor(COLORS.primary)
          .text(`Languages: ${langs}`);
      }
    }

    /* =======================
       WORK EXPERIENCE
       ======================= */

    if (cv.workExperience?.length) {
      addSection(doc, "Work Experience");

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

        if (job.technologies?.length) {
          doc
            .moveDown(0.2)
            .fontSize(FONTS.small)
            .fillColor(COLORS.secondary)
            .text(`Technologies: ${job.technologies.join(", ")}`);
        }

        doc.moveDown(0.8);
      });
    }

    /* =======================
       EDUCATION
       ======================= */

    if (cv.education?.length) {
      addSection(doc, "Education");

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

        if (edu.gpa || edu.honors) {
          doc
            .fontSize(FONTS.small)
            .fillColor(COLORS.primary)
            .text(
              [edu.gpa && `GPA: ${edu.gpa}`, edu.honors]
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
      addSection(doc, "Certifications");

      cv.certifications.forEach((cert) => {
        doc
          .font("Helvetica")
          .fontSize(FONTS.body)
          .fillColor(COLORS.primary)
          .text(
            `${cert.name} – ${cert.issuingOrg}${
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

        if (p.url) doc.text(p.url);

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

function addSection(doc: any, title: string) {
  doc.moveDown(0.9);
  doc
    .font("Helvetica-Bold")
    .fontSize(FONTS.heading)
    .fillColor(COLORS.primary)
    .text(title.toUpperCase());
  doc.moveDown(0.4);
}

function formatATSDate(dateStr: string): string {
  if (!dateStr || dateStr === "Present") return dateStr;
  const match = dateStr.match(/(\d{1,2})[\/-](\d{4})/);
  return match ? `${match[1].padStart(2, "0")}/${match[2]}` : dateStr;
}
