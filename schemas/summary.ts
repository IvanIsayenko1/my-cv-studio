import { z } from "zod";

export const summarySchema = z.object({
  professionalSummary: z
    .string()
    .min(50, "Summary should be at least 50 characters")
    .max(1000, "Summary should be less than 1000 characters"),
});

export type SummaryFormValues = z.infer<typeof summarySchema>;
