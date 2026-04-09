import { z } from "zod";

import { baseFieldAIReviewSchema } from "./ai-base-review";

export const cvProfessionalSummaryReviewSchema = baseFieldAIReviewSchema
  .extend({
    field: z.literal("professionalSummary"),
    isProfessional: z.boolean(),
    suggestions: z.array(z.string()),
  })
  .superRefine((value, ctx) => {
    if (value.field !== "professionalSummary") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Missing professionalSummary review result",
        path: ["field"],
      });
    }
  });

export type CVProfessionalSummaryAIReview = z.infer<
  typeof cvProfessionalSummaryReviewSchema
>;
