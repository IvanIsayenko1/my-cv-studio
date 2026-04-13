export { templateSchema, type TemplateFormValues } from "@/schemas/template";

export enum TemplateId {
  ATS_FRIENDLY_SIMPLE = "ats-friendly-simple",
  DESIGN_MINIMALIST = "design-minimalist",
}

export enum TemplateName {
  "ats-friendly-simple" = "ATS Friendly Simple",
  "design-minimalist" = "Design Minimalist",
}

export const TEMPLATE_OPTIONS = [
  {
    id: TemplateId.ATS_FRIENDLY_SIMPLE,
    name: TemplateName[TemplateId.ATS_FRIENDLY_SIMPLE],
    description: "Simple ATS-oriented layout",
    previewSrc: "/cv-templates/ats-friendly-simple.webp",
  },
  {
    id: TemplateId.DESIGN_MINIMALIST,
    name: TemplateName[TemplateId.DESIGN_MINIMALIST],
    description: "Minimalist design layout",
    previewSrc: "/cv-templates/design-minimalist.webp",
  },
] as const;
