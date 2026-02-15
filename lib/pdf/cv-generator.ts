import { CV } from "@/types/cv";
import { TemplateId } from "@/types/template";

import { generateATSCleanCV } from "./templates/ats-friendly-clean";
import { generateATSCleanColoredCV } from "./templates/ats-friendly-clean-colored";
import { generateModernTwoColumnCV } from "./templates/modern-timeline";

export async function generateCVPDF(cv: CV): Promise<Buffer> {
  if (cv.templateId === TemplateId.ATS_FRIENDLY_CLEAN) {
    return generateATSCleanCV(cv);
  }
  if (cv.templateId === TemplateId.ATS_FRIENDLY_CLEAN_COLORED) {
    return generateATSCleanColoredCV(cv);
  }
  if (cv.templateId === TemplateId.MODERN_TIMELINE) {
    return generateModernTwoColumnCV(cv);
  }

  return generateATSCleanCV(cv);
}
