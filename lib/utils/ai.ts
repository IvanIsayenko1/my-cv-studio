import { CV } from "@/types/cv";

import {
  BASE_CV_REVIEWER_PROMPT,
  CV_TAILOR_MODULE,
} from "../constants/ai-prompts";

const stripHtmlNoise = (html: string | undefined): string | undefined => {
  if (!html) return html;
  return html
    .replace(/\sstyle="[^"]*"/g, "")
    .replace(/<span>([\s\S]*?)<\/span>/g, "$1")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const slimCvForTailor = (cv: CV) => ({
  personalInfo: {
    professionalTitle: cv.personalInfo.professionalTitle,
  },
  professionalSummary: stripHtmlNoise(cv.professionalSummary),
  workExperience: cv.workExperience.map((w) => ({
    jobTitle: w.jobTitle,
    company: w.company,
    startDate: w.startDate,
    endDate: w.endDate,
    achievements: stripHtmlNoise(w.achievements),
    toolsAndMethods: w.toolsAndMethods,
  })),
  education: cv.education.map((e) => ({
    degree: e.degree,
    fieldOfStudy: e.fieldOfStudy,
    institution: e.institution,
    graduationDate: e.graduationDate,
  })),
  skills: {
    categories: cv.skills.categories.map((c) => ({
      name: c.name,
      items: stripHtmlNoise(c.items),
    })),
  },
  languages: cv.languages,
  certifications: cv.certifications,
  projects: cv.projects?.map((p) => ({
    name: p.name,
    role: p.role,
    startDate: p.startDate,
    endDate: p.endDate,
    description: stripHtmlNoise(p.description),
  })),
  awards: cv.awards,
  sections: cv.sections,
});

export const buildPrompt = <T>(object: T, specificField: string) => `
${BASE_CV_REVIEWER_PROMPT}

You will receive this object:

${JSON.stringify(object, null, 2)}

Analyze ONLY the requested field module below.

${specificField}
`;

export const buildTailorMessages = (cv: CV, jobOfferText: string) => ({
  system: `${BASE_CV_REVIEWER_PROMPT}\n\n${CV_TAILOR_MODULE}`,
  user: `Analyze this CV against the job offer and return JSON suggestions for improving alignment using ONLY existing CV content. Follow the output contract in the system message exactly.

CV Data:
${JSON.stringify(slimCvForTailor(cv))}

Job Offer Description:
${jobOfferText}`,
});
