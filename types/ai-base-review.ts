import z from "zod";

export const typoReviewSchema = z.object({
  hasTypos: z.boolean(),
  details: z.array(z.string()),
});

export const baseFieldAIReviewSchema = z.object({
  field: z.string(),
  score: z.number().min(1).max(10),
  summary: z.string().min(1),
  issues: z.array(z.string()),
  typos: typoReviewSchema,
});
