import z from "zod";

export const baseFieldAIReviewSchema = z.object({
  field: z.string(),
  issues: z.array(z.string()),
});
