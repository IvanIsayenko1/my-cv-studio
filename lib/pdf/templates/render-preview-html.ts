import { CV } from "@/types/cv";
import { TemplateId } from "@/types/template";

import { renderATSCleanPreviewHTML } from "./ats-friendly-clean-html";
import { renderVisualClearPreviewHTML } from "./visual-clear-html";

export function renderPreviewHTML(cv: CV): string {
  switch (cv.templateId) {
    case TemplateId.VISUAL_CLEAR:
      return renderVisualClearPreviewHTML(cv);
    case TemplateId.ATS_FRIENDLY_CLEAN:
    default:
      return renderATSCleanPreviewHTML(cv);
  }
}
