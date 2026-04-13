import { CV } from "@/types/cv";
import { TemplateId } from "@/types/template";

import { renderATSCleanPreviewHTML } from "./ats-friendly-clean-html";
import type { PreviewRenderOptions } from "./shared";
import { renderVisualClearPreviewHTML } from "./visual-clear-html";

export function renderPreviewHTML(
  cv: CV,
  options?: PreviewRenderOptions
): string {
  switch (cv.templateId) {
    case TemplateId.DESIGN_MINIMALIST:
      return renderVisualClearPreviewHTML(cv, options);
    case TemplateId.ATS_FRIENDLY_SIMPLE:
    default:
      return renderATSCleanPreviewHTML(cv, options);
  }
}
