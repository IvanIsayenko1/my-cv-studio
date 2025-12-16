// types/skills.ts
import { z } from "zod";

const nonEmptyArray = (label: string) =>
  z.array(z.string().min(1)).min(1, `Add at least one ${label}`);

export const languageItemSchema = z.object({
  language: z.string().min(1, "Language is required"),
  proficiency: z.string().min(1, "Proficiency is required"),
});

export const skillsSchema = z.object({
  skills: z.object({
    technical: z
      .array(z.string().min(1))
      .min(1, "Add at least one technical skill"),
    hard: nonEmptyArray("hard skill"),
    soft: nonEmptyArray("soft skill"),
    languages: z.array(languageItemSchema).min(1, "Add at least one language"),
  }),
});

export type SkillsFormValues = z.infer<typeof skillsSchema>;
