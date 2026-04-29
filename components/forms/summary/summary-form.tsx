"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";

import CVBuilderAIAssistant from "@/components/cv/cv-builder-ai-assistant/cv-builder-ai-assistant";
import SectionWrapper from "@/components/cv/cv-form-section-wrapper";
import ProfessionalSummaryAIAssistantDialog from "@/components/dialogs/professional-summary-ai-assistant-dialog";
import FormStatusBedge from "@/components/form-status-bedge";
import SectionRequieredsBedge from "@/components/section-requiered-bedge";
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
import { Spinner } from "@/components/ui/spinner";

import { useSaveSummary } from "@/hooks/cv/use-summary";
import { useFormDirtyState } from "@/hooks/use-form-dirty-state";

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
  sectionLabel,
  sectionVisible,
}: BuilderFormProps<SummaryFormValues>) {
  const { mutate, isPending } = useSaveSummary(id);
  const [isOpenAIAssistantDialog, setIsOpenAIAssistantDialog] = useState(false);
  const [aiReview, setAIReview] =
    useState<CVProfessionalSummaryAIReview | null>(null);

  const form = useForm<SummaryFormValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      professionalSummary: formData?.professionalSummary || "",
    },
  });
  // Track unsaved changes
  useFormDirtyState("summary", form.formState.isDirty);
  const isComplete = form.formState.isValid;

  const onSubmit = (values: SummaryFormValues) => {
    mutate(values, {
      onSuccess: () => form.reset(values),
    });
  };

  return (
    <SectionWrapper
      sectionId="summary"
      title={sectionLabel || "Professional Summary"}
      hiddenInPreview={sectionVisible === false}
      description="Write a concise, 3–5 sentence summary that highlights your key skills, experience, and target role."
      cvId={id}
      status={
        <div className="space-x-2">
          <FormStatusBedge isNotSaved={form.formState.isDirty} />
          <SectionRequieredsBedge isReady={isComplete} />
        </div>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
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
                    key={field.name}
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
              disabled={!isComplete || isPending}
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
              type="button"
              variant="secondary"
              disabled={!form.formState.isDirty || isPending}
              onClick={() => form.reset()}
            >
              <X className="h-4 w-4" />
              Discard changes
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="cv-form-primary-action"
            >
              {isPending ? <Spinner /> : <Save />}
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
