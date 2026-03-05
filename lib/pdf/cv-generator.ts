import { CV } from "@/types/cv";
import { TemplateId } from "@/types/template";

import { generateHTMLCVPDF } from "./html-generator";

export async function generateCVPDF(cv: CV): Promise<Buffer> {
  if (cv.templateId === TemplateId.ATS_FRIENDLY_CLEAN) {
    return generateHTMLCVPDF(cv);
  }
  // if (cv.templateId === TemplateId.ATS_FRIENDLY_CLEAN_COLORED) {
  //   return generateATSCleanColoredCV(cv);
  // }
  // if (cv.templateId === TemplateId.MODERN_TIMELINE) {
  //   return generateModernTwoColumnCV(cv);
  // }

  return generateHTMLCVPDF(cv);
}
