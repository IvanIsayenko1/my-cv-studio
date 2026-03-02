import { z } from "zod";

export const skillCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(64, "Category name must be less than 64 characters"),
  items: z.string().min(5, "Add at least one item to this category"),
});

export const skillsSchema = z.object({
  categories: z.array(skillCategorySchema).min(1, "Add at least one category"),
});

export type SkillsFormValues = z.infer<typeof skillsSchema>;
