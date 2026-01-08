// "@/types/work-experience.ts"
import { z } from "zod";
import { monthYearRegex } from "./regex";
export const workExperienceItemSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().min(1, "Location is required"),
  employmentType: z.enum([
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Internship",
  ]),
  startDate: z
    .string()
    .min(1, "Start date is required")
    .regex(monthYearRegex, "Use format MM/YYYY (e.g. 01/2022)"),
  endDate: z
    .string()
    .min(1, "End date or 'Present' is required")
    .refine(
      (val) => val.toLowerCase() === "present" || monthYearRegex.test(val),
      "Use 'Present' or MM/YYYY (e.g. 05/2024)"
    ),

  // REQUIRED array, never undefined
  achievements: z.array(z.string()).catch([]),

  // OPTIONAL array — can be undefined — but defaults to []
  technologies: z.array(z.string()).default([]).optional(),
});

export const workExperienceSchema = z.object({
  workExperience: z.array(workExperienceItemSchema),
});

export type WorkExperienceFormValues = z.infer<typeof workExperienceSchema>;
