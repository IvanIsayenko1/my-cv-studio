import { z } from "zod";

export const cvProfessionalSummaryReviewSchema = z
  .object({
    field: z.literal("professionalSummary"),
    issues: z.array(z.string()),
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
