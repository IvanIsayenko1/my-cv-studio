import { useState } from "react";

import { useSaveSummary } from "@/hooks/cv/use-summary";
import { useMediaQuery } from "@/hooks/use-media-query";

import { RESOLUTIONS } from "@/lib/constants/resolutions";

import { CVProfessionalSummaryAIReview } from "@/types/ai-professional-summary-review";

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
import { Textarea } from "../ui/textarea";

export default function ProfessionalSummaryAIAssistantDialog({
  isOpenDialog,
  setIsOpenDialog,
  aiReview,
  formId,
}: {
  isOpenDialog: boolean;
  setIsOpenDialog: (value: boolean) => void;
  aiReview: CVProfessionalSummaryAIReview | null;
  formId: string;
}) {
  const isDesktop = useMediaQuery(RESOLUTIONS.DESKTOP);
  const { mutate, isPending } = useSaveSummary(formId);
  const [isApplyingSuggestion, setIsApplyingSuggestion] = useState(false);

  const reviewNeedsAttention = aiReview ? aiReview.score < 8 : false;
  const suggestedSummary = aiReview?.suggestions[0] ?? "";

  const handleAcceptSuggestion = () => {
    if (!suggestedSummary) return;

    setIsApplyingSuggestion(true);
    mutate(
      {
        professionalSummary: suggestedSummary,
      },
      {
        onSettled: () => {
          setIsApplyingSuggestion(false);
        },
      }
    );
  };

  const dialogContent =
    reviewNeedsAttention && aiReview ? (
      <AIContentSuggestionCard
        cardKey={aiReview.field}
        title="Professional Summary"
        summary={aiReview.summary}
        issues={aiReview.issues}
        typos={aiReview.typos}
        onAccept={handleAcceptSuggestion}
        isPending={isPending && isApplyingSuggestion}
      >
        <CardContent className="m-[1px]">
          <Field className="gap-2">
            <FieldLabel htmlFor="professional-summary-ai-suggestion">
              Suggested Professional Summary
            </FieldLabel>
            <Textarea
              id="professional-summary-ai-suggestion"
              value={suggestedSummary}
              readOnly
              className="min-h-48 resize-none"
            />
            <FieldDescription>
              This suggestion rewrites your summary to be clearer, more
              credible, and more ATS-friendly while staying conservative.
            </FieldDescription>
          </Field>
        </CardContent>
      </AIContentSuggestionCard>
    ) : (
      <Card className="m-[1px]">
        <CardHeader>
          <CardTitle>All good!</CardTitle>
          <CardDescription>
            The AI review did not find any significant issues with your
            professional summary. It already reads clearly and professionally.
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
          <div className="flex-1 overflow-y-auto pr-1">{dialogContent}</div>
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
          <div className="min-h-0 flex-1 overflow-y-auto px-4">
            {dialogContent}
          </div>
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
