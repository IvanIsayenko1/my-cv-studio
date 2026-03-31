export { templateSchema, type TemplateFormValues } from "@/schemas/template";

export enum TemplateId {
  ATS_FRIENDLY_CLEAN = "ats-friendly-clean",
  VISUAL_CLEAR = "visual-clear",
}

export enum TemplateName {
  "ats-friendly-clean" = "ATS Friendly Clean",
  "visual-clear" = "Visual Clear",
}

export const TEMPLATE_OPTIONS = [
  {
    id: TemplateId.ATS_FRIENDLY_CLEAN,
    name: TemplateName[TemplateId.ATS_FRIENDLY_CLEAN],
    description: "Minimal ATS-oriented layout",
    previewSrc: "/cv-templates/ats-friendly-clean.webp",
  },
  {
    id: TemplateId.VISUAL_CLEAR,
    name: TemplateName[TemplateId.VISUAL_CLEAR],
    description: "Editorial layout inspired by the reference CV",
    previewSrc: "/cv-templates/visual-clear.webp",
  },
] as const;
