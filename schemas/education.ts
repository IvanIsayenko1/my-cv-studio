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
  grade: z.string().optional(),
  gradingScale: z.string().optional(),
  honors: z.string().optional(),
});

export const educationSchema = z.object({
  education: z.array(educationItemSchema),
});

export type EducationFormValues = z.infer<typeof educationSchema>;
