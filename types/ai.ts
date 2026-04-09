import { z } from "zod";

const typoReviewSchema = z.object({
  hasTypos: z.boolean(),
  details: z.array(z.string()),
});

const baseFieldAIReviewSchema = z.object({
  field: z.string(),
  score: z.number().min(1).max(10),
  summary: z.string().min(1),
  issues: z.array(z.string()),
  typos: typoReviewSchema,
});

export const professionalTitleAIReviewSchema = baseFieldAIReviewSchema.extend({
  field: z.literal("professionalTitle"),
  improvements: z.object({
    atsOptimized: z.string().min(1),
    balanced: z.string().min(1),
    humanFriendly: z.string().min(1),
  }),
  keywords: z.object({
    detected: z.array(z.string()),
    missing: z.array(z.string()),
  }),
});

export const emailAIReviewSchema = baseFieldAIReviewSchema.extend({
  field: z.literal("email"),
  isProfessional: z.boolean(),
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
