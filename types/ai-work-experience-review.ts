import { z } from "zod";

import { baseFieldAIReviewSchema } from "./ai-base-review";

export const workExperienceAchievementAIReviewSchema =
  baseFieldAIReviewSchema.extend({
    field: z.literal("achievements"),
    roleIndex: z.number().int().min(0),
    isImpactFocused: z.boolean(),
    suggestions: z.array(z.string()),
  });

export const cvWorkExperienceAIReviewSchema = z
  .object({
    results: z.array(workExperienceAchievementAIReviewSchema),
  })
  .superRefine((value, ctx) => {
    const seen = new Set<number>();

    value.results.forEach((result, index) => {
      if (seen.has(result.roleIndex)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Duplicate roleIndex in work experience review results",
          path: ["results", index, "roleIndex"],
        });
      }

      seen.add(result.roleIndex);
    });
  });

export type WorkExperienceAchievementAIReview = z.infer<
  typeof workExperienceAchievementAIReviewSchema
>;
export type CVWorkExperienceAIReview = z.infer<
  typeof cvWorkExperienceAIReviewSchema
>;
