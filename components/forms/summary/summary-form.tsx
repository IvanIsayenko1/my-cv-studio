"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { useSaveSummary, useSummary } from "@/hooks/cv/use-summary";

import { QUERY_KEYS } from "@/lib/constants/query-keys";

import { SummaryFormValues, summarySchema } from "@/types/summary";

interface SummaryFormProps {
  setIsDirtyForm: (isDirty: boolean) => void;
  id: string;
}

export function SummaryForm({ setIsDirtyForm, id }: SummaryFormProps) {
  const { data } = useSummary(id);
  const { mutate, isPending } = useSaveSummary(id);
  const queryClient = useQueryClient();

  const form = useForm<SummaryFormValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      professionalSummary: "",
    },
  });

  useEffect(() => {
    if (data?.professionalSummary) {
      form.reset({
        professionalSummary: data.professionalSummary ?? "",
      });
      setIsDirtyForm(false);
    }
  }, [data, form, setIsDirtyForm]);

  const { isDirty } = form.formState;

  useEffect(() => {
    setIsDirtyForm(isDirty);
  }, [isDirty, setIsDirtyForm]);

  const onSubmit = (values: SummaryFormValues) => {
    mutate(values, {
      onSuccess: () => {
        setIsDirtyForm(false);
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATUS, id] });
      },
    });
  };

  return (
    <Card>
      <CardHeader className="px-5 sm:px-6">
        <CardTitle>Professional Summary</CardTitle>
        <CardDescription>
          Write a concise, 3–5 sentence summary that highlights your key skills,
          experience, and target role.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-5 sm:px-6">
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
                    <Textarea
                      rows={6}
                      placeholder="Experienced frontend developer with 5+ years..."
                      {...field}
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
      </CardContent>
    </Card>
  );
}
