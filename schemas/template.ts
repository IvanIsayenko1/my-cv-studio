import { z } from "zod";

export const templateSchema = z.object({
  id: z.string().min(1, "Please select a template"),
});

export type TemplateFormValues = z.infer<typeof templateSchema>;
