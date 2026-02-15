import { z } from "zod";

import { monthYearRegex } from "@/config/regex";

export const educationItemSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  institution: z.string().min(1, "Institution is required"),
  location: z.string().min(1, "Location is required"),
  graduationDate: z
    .string()
    .min(1, "Graduation date is required")
    .regex(monthYearRegex, "Use format MM/YYYY (e.g. 01/2022)"),
  gpa: z
    .number()
    .min(0, "GPA must be at least 0")
    .max(10, "GPA must be at most 10")
    .or(z.nan())
    .transform((v) => (Number.isNaN(v) ? undefined : v))
    .optional(),
  honors: z.string().optional(),
});

export const educationSchema = z.object({
  education: z.array(educationItemSchema),
});

export type EducationFormValues = z.infer<typeof educationSchema>;
