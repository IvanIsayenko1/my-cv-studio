"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import { SummaryFormSkeleton } from "./summary-form-skeleton";
import { fetchSummary, postSummary } from "@/lib/queries/summary-queries";

const summarySchema = z.object({
  professionalSummary: z
    .string()
    .min(50, "Summary should be at least 50 characters")
    .max(1000, "Summary should be less than 1000 characters"),
});

type SummaryFormValues = z.infer<typeof summarySchema>;

interface SummaryFormProps {
  setIsDirtyForm: (isDirty: boolean) => void;
  id: string;
}

export function SummaryForm({ setIsDirtyForm, id }: SummaryFormProps) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["summary", id],
    queryFn: () => fetchSummary(id),
  });

  const form = useForm<SummaryFormValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      professionalSummary: "",
    },
  });

  // populate when data loads
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

  const mutation = useMutation({
    mutationKey: ["summary", id],
    mutationFn: (values: SummaryFormValues) => postSummary(id, values),
    onSuccess: () => {
      toast.success("Summary has been updated");
      queryClient.invalidateQueries({ queryKey: ["summary", id] });
      setIsDirtyForm(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (values: SummaryFormValues) => {
    mutation.mutate(values);
  };

  if (isLoading && !data) {
    return <SummaryFormSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Summary</CardTitle>
        <CardDescription>
          Write a concise, 3–5 sentence summary that highlights your key skills,
          experience, and target role.
        </CardDescription>
      </CardHeader>
      <CardContent>
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

            <div className="flex justify-end gap-3">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
