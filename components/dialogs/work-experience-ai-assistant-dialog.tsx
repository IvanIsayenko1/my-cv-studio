import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useSaveWorkExperience } from "@/hooks/cv/use-work-experience";
import { useMediaQuery } from "@/hooks/use-media-query";

import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { RESOLUTIONS } from "@/lib/constants/resolutions";

import { CVWorkExperienceAIReview } from "@/types/ai-work-experience-review";
import { WorkExperienceFormValues } from "@/types/work-experience";

import AIContentSuggestionCard from "../ai/ai-content-suggestion-card";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import {
  MobileOverlay,
  MobileOverlayBody,
  MobileOverlayClose,
  MobileOverlayContent,
  MobileOverlayFooter,
  MobileOverlayHeader,
  MobileOverlayTitle,
} from "../ui/mobile-overlay";
import { RichTextEditor } from "../ui/rich-text-editor";

export default function WorkExperienceAIAssistantDialog({
  isOpenDialog,
  setIsOpenDialog,
  aiReview,
  formId,
  currentValues,
  onLocalApplySuggestion,
}: {
  isOpenDialog: boolean;
  setIsOpenDialog: (value: boolean) => void;
  aiReview: CVWorkExperienceAIReview | null;
  formId: string;
  currentValues: WorkExperienceFormValues;
  onLocalApplySuggestion: (roleIndex: number, achievements: string) => void;
}) {
  const isDesktop = useMediaQuery(RESOLUTIONS.DESKTOP);
  const queryClient = useQueryClient();
  const { mutate, isPending } = useSaveWorkExperience(formId);
  const [pendingSuggestionKey, setPendingSuggestionKey] = useState<
    string | null
  >(null);

  const reviewNeedsAttention = aiReview
    ? aiReview.results.filter((result) => result.score < 7)
    : [];

  const handleAcceptSuggestion = (
    roleIndex: number,
    suggestionIndex: number,
    suggestedValue: string
  ) => {
    if (!suggestedValue) return;
    if (!currentValues.workExperience[roleIndex]) return;
    const normalizedSuggestion = toEditorHtml(suggestedValue);

    const nextValues: WorkExperienceFormValues = {
      workExperience: currentValues.workExperience.map((role, index) =>
        index === roleIndex
          ? { ...role, achievements: normalizedSuggestion }
          : role
      ),
    };

    const suggestionKey = `${roleIndex}-${suggestionIndex}`;
    setPendingSuggestionKey(suggestionKey);
    mutate(nextValues, {
      onSuccess: () => {
        onLocalApplySuggestion(roleIndex, normalizedSuggestion);
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.STATUS, formId],
        });
      },
      onSettled: () => {
        setPendingSuggestionKey((current) =>
          current === suggestionKey ? null : current
        );
      },
    });
  };

  const toEditorHtml = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";

    if (/<(ul|ol|li|p|br)\b/i.test(trimmed)) {
      return trimmed;
    }

    const lines = trimmed
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const bulletLines = lines
      .map((line) => line.replace(/^[-*•]\s*/, "").trim())
      .filter(Boolean);

    if (lines.length > 1) {
      return `<ul>${bulletLines.map((line) => `<li>${line}</li>`).join("")}</ul>`;
    }

    return `<p>${trimmed}</p>`;
  };

  const dialogContent =
    reviewNeedsAttention.length > 0 ? (
      reviewNeedsAttention.map((review) => {
        const role = currentValues.workExperience[review.roleIndex];
        const roleTitle = role
          ? `${role.jobTitle || "Untitled Role"}${role.company ? ` at ${role.company}` : ""}`
          : `Role ${review.roleIndex + 1}`;

        return (
          <AIContentSuggestionCard
            cardKey={`role-${review.roleIndex}`}
            title={roleTitle}
            summary={review.summary}
            issues={review.issues}
            typos={review.typos}
            onAccept={() => {}}
            isPending={false}
            showDefaultAction={false}
          >
            <CardContent className="space-y-4">
              {review.suggestions.map((suggestion, suggestionIndex) => (
                <Field
                  key={`${review.roleIndex}-${suggestionIndex}`}
                  className="gap-2"
                >
                  <FieldLabel
                    htmlFor={`work-experience-ai-${review.roleIndex}-${suggestionIndex}`}
                  >
                    Suggestion
                  </FieldLabel>
                  <RichTextEditor
                    value={toEditorHtml(suggestion)}
                    onChange={() => {}}
                    disabled
                    minHeightClassName="min-h-32"
                    className="bg-background"
                  />
                  <FieldDescription>
                    This rewrite focuses on outcomes, impact, and what was
                    achieved in the role instead of listing responsibilities
                    only.
                  </FieldDescription>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      className="cv-form-primary-action"
                      disabled={
                        isPending &&
                        pendingSuggestionKey ===
                          `${review.roleIndex}-${suggestionIndex}`
                      }
                      onClick={() =>
                        handleAcceptSuggestion(
                          review.roleIndex,
                          suggestionIndex,
                          suggestion
                        )
                      }
                    >
                      {isPending &&
                      pendingSuggestionKey ===
                        `${review.roleIndex}-${suggestionIndex}`
                        ? "Applying..."
                        : "Apply Suggestion"}
                    </Button>
                  </div>
                </Field>
              ))}
            </CardContent>
          </AIContentSuggestionCard>
        );
      })
    ) : (
      <Card>
        <CardHeader>
          <CardTitle>All good!</CardTitle>
          <CardDescription>
            The AI review did not find any significant issues with your key
            achievements. They already emphasize impact and what you achieved in
            each role.
          </CardDescription>
        </CardHeader>
      </Card>
    );

  if (isDesktop) {
    return (
      <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
        <DialogContent className="flex max-h-[min(85vh,42rem)] flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle>Review the AI Suggestions</DialogTitle>
          </DialogHeader>
          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {dialogContent}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <MobileOverlay open={isOpenDialog} onOpenChange={setIsOpenDialog}>
      <MobileOverlayContent
        className="flex max-h-[calc(100%-1rem)] flex-col"
        onPointerDownOutside={() => setIsOpenDialog(false)}
      >
        <MobileOverlayHeader>
          <MobileOverlayTitle>Review the AI Suggestions</MobileOverlayTitle>
        </MobileOverlayHeader>

        <MobileOverlayBody className="min-h-0 flex-1 space-y-4">
          {dialogContent}
        </MobileOverlayBody>

        <MobileOverlayFooter>
          <MobileOverlayClose asChild>
            <Button variant="outline" size="lg" className="w-full">
              Close
            </Button>
          </MobileOverlayClose>
        </MobileOverlayFooter>
      </MobileOverlayContent>
    </MobileOverlay>
  );
}
