import { z } from "zod";

import { baseFieldAIReviewSchema } from "./ai-base-review";

export const skillsCategoryAIReviewSchema = baseFieldAIReviewSchema.extend({
  field: z.literal("skillsCategory"),
  categoryIndex: z.number().int().min(0),
  isCoherent: z.boolean(),
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
