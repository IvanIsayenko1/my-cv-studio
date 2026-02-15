import { z } from "zod";

import { monthYearRegex } from "@/config/regex";

export const projectItemSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  role: z.string().min(1, "Role is required"),
  startDate: z
    .string()
    .min(1, "Start date is required")
    .regex(monthYearRegex, "Use format MM/YYYY (e.g. 01/2022)"),
  endDate: z
    .string()
    .min(1, "End date is required")
    .refine(
      (val) => val.toLowerCase() === "present" || monthYearRegex.test(val),
      "Use 'Present' or MM/YYYY (e.g. 05/2024)"
    ),
  description: z.string().min(1, "Description is required"),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export const projectsSchema = z.object({
  projects: z.array(projectItemSchema).optional(),
});

export type ProjectsFormValues = z.infer<typeof projectsSchema>;
