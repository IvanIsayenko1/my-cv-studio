import { z } from "zod";

export const professionalTitleAIReviewSchema = z.object({
  field: z.literal("professionalTitle"),
  issues: z.array(z.string()),
  suggested: z.string().min(1),
});

export const emailAIReviewSchema = z.object({
  field: z.literal("email"),
  issues: z.array(z.string()),
  suggestions: z.array(z.string()),
});

export const cvPersonalInformationAIReviewSchema = z
  .object({
    results: z
      .array(z.union([professionalTitleAIReviewSchema, emailAIReviewSchema]))
      .length(2),
  })
  .superRefine((value, ctx) => {
    const fields = new Set(value.results.map((result) => result.field));

    if (!fields.has("professionalTitle")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Missing professionalTitle review result",
        path: ["results"],
      });
    }

    if (!fields.has("email")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Missing email review result",
        path: ["results"],
      });
    }
  });

export type ProfessionalTitleAIReview = z.infer<
  typeof professionalTitleAIReviewSchema
>;
export type EmailAIReview = z.infer<typeof emailAIReviewSchema>;
export type CVPersonalInformationAIReview = z.infer<
  typeof cvPersonalInformationAIReviewSchema
>;
