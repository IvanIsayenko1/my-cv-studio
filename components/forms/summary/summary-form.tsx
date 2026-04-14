"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import CVBuilderAIAssistant from "@/components/cv/cv-builder-ai-assistant/cv-builder-ai-assistant";
import SectionWrapper from "@/components/cv/cv-form-section-wrapper";
import ProfessionalSummaryAIAssistantDialog from "@/components/dialogs/professional-summary-ai-assistant-dialog";
import StatusBedge from "@/components/status-bedge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

import { useSaveSummary } from "@/hooks/cv/use-summary";

import { PROFESSIONAL_SUMMARY_MODULE } from "@/lib/constants/ai-prompts";

import {
  CVProfessionalSummaryAIReview,
  cvProfessionalSummaryReviewSchema,
} from "@/types/ai-professional-summary-review";
import { BuilderFormProps } from "@/types/builder-form";
import { SummaryFormValues, summarySchema } from "@/types/summary";

export function SummaryForm({
  id,
  formData,
}: BuilderFormProps<SummaryFormValues>) {
  const { mutate, isPending } = useSaveSummary(id);
  const [isOpenAIAssistantDialog, setIsOpenAIAssistantDialog] = useState(false);
  const [aiReview, setAIReview] =
    useState<CVProfessionalSummaryAIReview | null>(null);

  const form = useForm<SummaryFormValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      professionalSummary: formData.professionalSummary || "",
    },
  });
  const isComplete = form.formState.isValid;

  const onSubmit = (values: SummaryFormValues) => {
    mutate(values);
  };

  return (
    <SectionWrapper
      sectionId="summary"
      title="Professional Summary"
      description="Write a concise, 3–5 sentence summary that highlights your key skills, experience, and target role."
      cvId={id}
      status={
        <StatusBedge
          isReady={isComplete}
          readyText="Complete"
          notReadyText="Incomplete"
        />
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="professionalSummary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Summary
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <RichTextEditor
                    {...field}
                    placeholder="Experienced frontend developer with 5+ years..."
                  />
                </FormControl>
                <FormDescription>
                  Focus on achievements, core skills, and what you’re looking
                  for next.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="cv-form-actions">
            <CVBuilderAIAssistant<CVProfessionalSummaryAIReview>
              value={form.getValues()}
              prompt={PROFESSIONAL_SUMMARY_MODULE}
              responseSchema={cvProfessionalSummaryReviewSchema}
              handleResponse={(response) => {
                if (!response) return;
                setAIReview(response);
                setIsOpenAIAssistantDialog(true);
              }}
            />
            <Button
              type="submit"
              disabled={isPending}
              className="cv-form-primary-action"
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>

      <ProfessionalSummaryAIAssistantDialog
        isOpenDialog={isOpenAIAssistantDialog}
        setIsOpenDialog={setIsOpenAIAssistantDialog}
        aiReview={aiReview}
        formId={id}
      />
    </SectionWrapper>
  );
}
