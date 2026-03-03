"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

import SectionWrapper from "@/components/cv/cv-form-section-wrapper";
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

import { useSaveSummary, useSummary } from "@/hooks/cv/use-summary";

import { QUERY_KEYS } from "@/lib/constants/query-keys";

import { SummaryFormValues, summarySchema } from "@/types/summary";

interface SummaryFormProps {
  id: string;
}

export function SummaryForm({ id }: SummaryFormProps) {
  const { data } = useSummary(id);
  const { mutate, isPending } = useSaveSummary(id);
  const queryClient = useQueryClient();

  const form = useForm<SummaryFormValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      professionalSummary: "",
    },
  });
  const isComplete = form.formState.isValid;

  useEffect(() => {
    if (data?.professionalSummary) {
      form.reset({
        professionalSummary: data.professionalSummary ?? "",
      });
    }
  }, [data, form]);

  const onSubmit = (values: SummaryFormValues) => {
    mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATUS, id] });
      },
    });
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
    </SectionWrapper>
  );
}
