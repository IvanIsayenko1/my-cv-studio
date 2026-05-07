import { z } from "zod";

export const skillsCategoryAIReviewSchema = z.object({
  categoryIndex: z.number().int().min(0),
  issues: z.array(z.string()),
  suggestedName: z.string().min(1),
  suggestedItems: z.string().min(1),
});

export const cvSkillsAIReviewSchema = z
  .object({
    results: z.array(skillsCategoryAIReviewSchema),
  })
  .superRefine((value, ctx) => {
    const seen = new Set<number>();

    value.results.forEach((result, index) => {
      if (seen.has(result.categoryIndex)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Duplicate categoryIndex in skills review results",
          path: ["results", index, "categoryIndex"],
        });
      }

      seen.add(result.categoryIndex);
    });
  });

export type SkillsCategoryAIReview = z.infer<typeof skillsCategoryAIReviewSchema>;
export type CVSkillsAIReview = z.infer<typeof cvSkillsAIReviewSchema>;
