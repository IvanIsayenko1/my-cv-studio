import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useSaveSkills } from "@/hooks/cv/use-skills";

import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { RESOLUTIONS } from "@/lib/constants/resolutions";

import { CVSkillsAIReview } from "@/types/ai-skills-review";
import { SkillsFormValues } from "@/types/skills";

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
import { Input } from "../ui/input";
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

export default function SkillsAIAssistantDialog({
  isOpenDialog,
  setIsOpenDialog,
  aiReview,
  formId,
  currentValues,
}: {
  isOpenDialog: boolean;
  setIsOpenDialog: (value: boolean) => void;
  aiReview: CVSkillsAIReview | null;
  formId: string;
  currentValues: SkillsFormValues;
}) {
  const isDesktop = useMediaQuery(RESOLUTIONS.DESKTOP);
  const queryClient = useQueryClient();
  const { mutate, isPending } = useSaveSkills(formId);
  const [pendingCategoryIndex, setPendingCategoryIndex] = useState<number | null>(
    null
  );

  const reviewNeedsAttention = aiReview
    ? aiReview.results.filter((result) => result.score < 8)
    : [];

  const handleAcceptSuggestion = (
    categoryIndex: number,
    suggestedName: string,
    suggestedItems: string
  ) => {
    if (!currentValues.categories[categoryIndex]) return;
    if (!suggestedName || !suggestedItems) return;

    const nextValues: SkillsFormValues = {
      categories: currentValues.categories.map((category, index) =>
        index === categoryIndex
          ? {
              ...category,
              name: suggestedName,
              items: suggestedItems,
            }
          : category
      ),
    };

    setPendingCategoryIndex(categoryIndex);
    mutate(nextValues, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATUS, formId] });
      },
      onSettled: () => {
        setPendingCategoryIndex((current) =>
          current === categoryIndex ? null : current
        );
      },
    });
  };

  const toListHtml = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";

    if (/<(ul|ol|li)\b/i.test(trimmed)) {
      return trimmed;
    }

    const lines = trimmed
      .split("\n")
      .map((line) => line.replace(/^[-*•]\s*/, "").trim())
      .filter(Boolean);

    return `<ul>${lines.map((line) => `<li>${line}</li>`).join("")}</ul>`;
  };

  const dialogContent =
    reviewNeedsAttention.length > 0 ? (
      reviewNeedsAttention.map((review) => {
        const category = currentValues.categories[review.categoryIndex];
        const title = category?.name?.trim()
          ? category.name
          : `Category ${review.categoryIndex + 1}`;

        return (
          <AIContentSuggestionCard
            key={`skills-${review.categoryIndex}`}
            cardKey={`skills-${review.categoryIndex}`}
            title={title}
            summary={review.summary}
            issues={review.issues}
            typos={review.typos}
            onAccept={() =>
              handleAcceptSuggestion(
                review.categoryIndex,
                review.suggestedName,
                toListHtml(review.suggestedItems)
              )
            }
            isPending={isPending && pendingCategoryIndex === review.categoryIndex}
          >
            <CardContent className="space-y-4">
              <Field className="gap-2">
                <FieldLabel htmlFor={`skills-ai-name-${review.categoryIndex}`}>
                  Suggested Category Name
                </FieldLabel>
                <Input
                  id={`skills-ai-name-${review.categoryIndex}`}
                  value={review.suggestedName}
                  readOnly
                />
                <FieldDescription>
                  The category name should clearly describe the skills grouped
                  below.
                </FieldDescription>
              </Field>

              <Field className="gap-2">
                <FieldLabel>Suggested Items</FieldLabel>
                <RichTextEditor
                  value={toListHtml(review.suggestedItems)}
                  onChange={() => {}}
                  disabled
                  mode="list-only"
                  minHeightClassName="min-h-28"
                />
                <FieldDescription>
                  These items are regrouped to make the category more coherent
                  and easier to understand.
                </FieldDescription>
              </Field>
            </CardContent>
          </AIContentSuggestionCard>
        );
      })
    ) : (
      <Card>
        <CardHeader>
          <CardTitle>All good!</CardTitle>
          <CardDescription>
            The AI review did not find any significant issues with your skill
            categories. The labels and grouped items already make sense.
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
