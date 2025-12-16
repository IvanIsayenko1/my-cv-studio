// src/types/projects.ts
import { z } from "zod";

export const projectItemSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  role: z.string().min(1, "Role is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  description: z.string().min(1, "Description is required"),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export const projectsSchema = z.object({
  projects: z.array(projectItemSchema).optional(),
});

export type ProjectsFormValues = z.infer<typeof projectsSchema>;
