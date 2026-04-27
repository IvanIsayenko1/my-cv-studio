import { z } from "zod";

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
});

export type TemplateConfigFormValues = z.infer<typeof templateConfigSchema>;
