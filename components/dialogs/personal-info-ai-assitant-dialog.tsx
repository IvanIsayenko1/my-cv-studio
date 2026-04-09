import { useState } from "react";

import {
  usePersonalInfo,
  useSavePersonalInfo,
} from "@/hooks/cv/use-personal-info";
import { useMediaQuery } from "@/hooks/use-media-query";

import { RESOLUTIONS } from "@/lib/constants/resolutions";

import { CVPersonalInformationAIReview } from "@/types/ai";
import { PersonalInfoFormValues } from "@/types/personal-info";

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

export default function PersonalInfoAIAssistantDialog({
  isOpenDialog,
  setIsOpenDialog,
  aiReview,
  formId,
}: {
  isOpenDialog: boolean;
  setIsOpenDialog: (value: boolean) => void;
  aiReview: CVPersonalInformationAIReview | null;
  formId: string;
}) {
  const isDesktop = useMediaQuery(RESOLUTIONS.DESKTOP);
  const { data: personalInfo } = usePersonalInfo(formId);
  const { mutate, isPending } = useSavePersonalInfo(formId);
  const reviewNeedsAttention = aiReview
    ? aiReview.results.filter((result) => result.score < 8)
    : [];

  const fieldConfig = {
    professionalTitle: {
      title: "Professional Title",
      inputId: "personal-info-ai-professional-title",
      label: "Suggested Professional Title",
      description:
        "This suggestion is optimized for both ATS and human readers, providing a good balance between keyword optimization and readability.",
      apply: (
        values: PersonalInfoFormValues,
        nextValue: string
      ): PersonalInfoFormValues => ({
        ...values,
        professionalTitle: nextValue,
      }),
    },
    email: {
      title: "Email",
      inputId: "personal-info-ai-email",
      label: "Suggested Email",
      description:
        "This email is more professional and consistent with your name.",
      apply: (
        values: PersonalInfoFormValues,
        nextValue: string
      ): PersonalInfoFormValues => ({
        ...values,
        email: nextValue,
      }),
    },
  } as const;

  const getFieldConfig = (field: keyof typeof fieldConfig) => {
    return fieldConfig[field];
  };
  const [pendingField, setPendingField] = useState<keyof typeof fieldConfig | null>(
    null
  );

  const getReviewPresentation = (
    review: CVPersonalInformationAIReview["results"][number]
  ) => {
    switch (review.field) {
      case "professionalTitle": {
        const config = getFieldConfig("professionalTitle");
        return {
          ...config,
          field: review.field,
          suggestedValue: review.improvements.balanced,
        };
      }
      case "email": {
        const config = getFieldConfig("email");
        return {
          ...config,
          field: review.field,
          suggestedValue: review.suggestions[0] ?? "",
        };
      }
    }
  };

  const handleAcceptSuggestion = (
    field: keyof typeof fieldConfig,
    suggestedValue: string
  ) => {
    if (!personalInfo) return;
    if (!suggestedValue) return;

    const config = getFieldConfig(field);
    setPendingField(field);
    mutate(config.apply(personalInfo, suggestedValue), {
      onSettled: () => {
        setPendingField((current) => (current === field ? null : current));
      },
    });
  };

  const dialogContent =
    reviewNeedsAttention.length > 0 ? (
      reviewNeedsAttention.map((review) => {
        const presentation = getReviewPresentation(review);

        return (
          <AIContentSuggestionCard
            cardKey={review.field}
            title={presentation.title}
            summary={review.summary}
            issues={review.issues}
            onAccept={() =>
              handleAcceptSuggestion(
                presentation.field,
                presentation.suggestedValue
              )
            }
            isPending={isPending && pendingField === review.field}
          >
            <CardContent>
              <Field className="gap-2">
                <FieldLabel htmlFor={presentation.inputId}>
                  {presentation.label}
                </FieldLabel>
                <Input
                  id={presentation.inputId}
                  type={review.field === "email" ? "email" : "text"}
                  value={presentation.suggestedValue}
                  readOnly
                />
                <FieldDescription>{presentation.description}</FieldDescription>
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
            The AI review did not find any significant issues with your personal
            information. It looks well-optimized for both ATS and human readers.
            Great job!
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
          <div className="flex-1 space-y-4 overflow-y-auto pr-1">{dialogContent}</div>
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

        <MobileOverlayBody className="min-h-0 flex-1 space-y-2">
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
