import { z } from "zod";

import { WorkExperienceFormValues } from "./work-experience";

export const workExperienceAchievementAIReviewSchema = z.object({
  roleIndex: z.number().int().min(0),
  issues: z.array(z.string()),
  suggested: z.string().min(1),
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

export interface WorkExperienceAIAssistantDialogProps {
  isOpenDialog: boolean;
  setIsOpenDialog: (value: boolean) => void;
  aiReview: CVWorkExperienceAIReview | null;
  formId: string;
  currentValues: WorkExperienceFormValues;
  onLocalApplySuggestion: (roleIndex: number, achievements: string) => void;
}
