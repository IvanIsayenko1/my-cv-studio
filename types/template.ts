export { templateSchema, type TemplateFormValues } from "@/schemas/template";

export enum TemplateId {
  ATS_FRIENDLY_CLEAN = "ats-friendly-clean",
  ATS_FRIENDLY_CLEAN_COLORED = "ats-friendly-clean-colored",
  MODERN_TIMELINE = "modern-timeline",
}

export enum TemplateName {
  "ats-friendly-clean" = "ATS Friendly Clean",
  "ats-friendly-clean-colored" = "ATS Friendly Clean Colored",
  "modern-timeline" = "Modern Timeline",
}

export enum TemplateDescription {
  "ats-friendly-clean" = "A basic template that is optimized for ATS (Applicant Tracking System) compatibility.",
  "ats-friendly-clean-colored" = "A colored template that is optimized for ATS (Applicant Tracking System) compatibility.",
  "modern-timeline" = "A modern timeline template.",
}
