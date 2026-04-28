import { z } from "zod";

export const sectionConfigSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Section name cannot be empty"),
  order: z.number().int(),
  visible: z.boolean(),
});

export const templateConfigSchema = z.object({
  accentColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Invalid color format")
    .optional(),
  customAccentColor: z
    .string()
    .refine(
      (val) => !val || /^#[0-9A-F]{6}$/i.test(val),
      "Invalid color format"
    )
    .optional(),
  sections: z.array(sectionConfigSchema).optional(),
});

export type TemplateConfigFormValues = z.infer<typeof templateConfigSchema>;
export type SectionConfig = z.infer<typeof sectionConfigSchema>;
