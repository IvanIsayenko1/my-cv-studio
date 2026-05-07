import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useSaveWorkExperience } from "@/hooks/cv/use-work-experience";
import { useMediaQuery } from "@/hooks/use-media-query";

import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { RESOLUTIONS } from "@/lib/constants/resolutions";

import type { WorkExperienceAIAssistantDialogProps } from "@/types/ai-work-experience-review";
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { Field, FieldDescription, FieldLabel } from "../ui/field";
import { RichTextEditor } from "../ui/rich-text-editor";

export default function WorkExperienceAIAssistantDialog({
  isOpenDialog,
  setIsOpenDialog,
  aiReview,
  formId,
  currentValues,
  onLocalApplySuggestion,
}: WorkExperienceAIAssistantDialogProps) {
  // React built-in hooks
  const [pendingSuggestionKey, setPendingSuggestionKey] = useState<
    string | null
  >(null);

  // Custom hooks
  const isDesktop = useMediaQuery(RESOLUTIONS.DESKTOP);
  const queryClient = useQueryClient();
  const { mutate, isPending } = useSaveWorkExperience(formId);

  // Filter reviews that have issues needing attention
  const reviewNeedsAttention = aiReview
    ? aiReview.results.filter((result) => result.issues.length > 0)
    : [];

  /**
   * Converts raw text or markdown to editor-compatible HTML format
   * @param value - The input string to convert (can be plain text, markdown, or HTML)
   * @returns Formatted HTML string for the rich text editor
   */
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

  /**
   * Handles accepting an AI suggestion for a specific work experience role
   * @param roleIndex - The index of the work experience role to update
   * @param suggestedValue - The AI-suggested achievements text to apply
   */
  const handleAcceptSuggestion = (
    roleIndex: number,
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

    setPendingSuggestionKey(`${roleIndex}`);
    mutate(nextValues, {
      onSuccess: () => {
        onLocalApplySuggestion(roleIndex, normalizedSuggestion);
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.STATUS, formId],
        });
      },
      onSettled: () => {
        setPendingSuggestionKey((current) =>
          current === `${roleIndex}` ? null : current
        );
      },
    });
  };

  // Render dialog content based on AI review results
  const dialogContent =
    reviewNeedsAttention.length > 0 ? (
      reviewNeedsAttention.map((review) => {
        const role = currentValues.workExperience[review.roleIndex];
        const roleTitle = role
          ? `${role.jobTitle || "Untitled Role"}${role.company ? ` at ${role.company}` : ""}`
          : `Role ${review.roleIndex + 1}`;

        return (
          <div className="mb-4">
            <AIContentSuggestionCard
              cardKey={`role-${review.roleIndex}`}
              title={roleTitle}
              issues={review.issues}
              onAccept={() =>
                handleAcceptSuggestion(review.roleIndex, review.suggested)
              }
              isPending={
                isPending && pendingSuggestionKey === `${review.roleIndex}`
              }
            >
              <CardContent className="space-y-4">
                <Field className="gap-2">
                  <FieldLabel
                    htmlFor={`work-experience-ai-${review.roleIndex}`}
                  >
                    Suggested Achievements
                  </FieldLabel>
                  <RichTextEditor
                    value={toEditorHtml(review.suggested)}
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
                </Field>
              </CardContent>
            </AIContentSuggestionCard>
          </div>
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
        <DialogContent className="flex max-h-[min(85vh,42rem)] flex-col overflow-hidden sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Review the AI Suggestions</DialogTitle>
          </DialogHeader>
          <div className="scrollbar-hide space-y-4 overflow-y-auto p-1">
            {dialogContent}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpenDialog} onOpenChange={setIsOpenDialog}>
      <DrawerContent
        className="flex max-h-[calc(100%-1rem)] flex-col"
        onPointerDownOutside={() => setIsOpenDialog(false)}
      >
        <DrawerHeader>
          <DrawerTitle>Review the AI Suggestions</DrawerTitle>
        </DrawerHeader>

        <DrawerDescription asChild>
          <div className="min-h-0 flex-1 space-y-4 px-4">{dialogContent}</div>
        </DrawerDescription>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" size="lg" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
