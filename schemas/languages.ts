import { z } from "zod";

export const languageItemSchema = z.object({
  language: z.string().min(1, "Language is required"),
  proficiency: z.string().min(1, "Proficiency is required"),
});

export const languagesSchema = z.object({
  languages: z.array(languageItemSchema),
});

export type LanguagesFormValues = z.infer<typeof languagesSchema>;
