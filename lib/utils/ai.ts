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
  professionalTitle: cv.personalInfo.professionalTitle,
  professionalSummary: stripHtmlNoise(cv.professionalSummary),
  workExperience: cv.workExperience.map((w) => ({
    jobTitle: w.jobTitle,
    company: w.company,
    achievements: stripHtmlNoise(w.achievements),
  })),
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
