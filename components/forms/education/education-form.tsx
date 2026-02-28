"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

import SectionWrapper from "@/components/cv/cv-form-section-wrapper";
import { RemoveEducationDialog } from "@/components/dialogs/remove-education-dialog";
import StatusBedge from "@/components/status-bedge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MonthYearPicker } from "@/components/ui/month-year-picker";
import { Separator } from "@/components/ui/separator";

import { useEducation, useSaveEducation } from "@/hooks/cv/use-education";

import { QUERY_KEYS } from "@/lib/constants/query-keys";

import { EducationFormValues, educationSchema } from "@/types/education";

interface EducationFormProps {
  id: string;
}

export function EducationForm({ id }: EducationFormProps) {
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const { data } = useEducation(id);
  const { mutate, isPending } = useSaveEducation(id);
  const queryClient = useQueryClient();

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education: [
        {
          degree: "",
          fieldOfStudy: "",
          institution: "",
          location: "",
          graduationDate: "",
          grade: "",
          gradingScale: "",
          honors: "",
        },
      ],
    },
  });

  const { control, reset, formState, handleSubmit } = form;
  const isComplete = form.formState.isValid;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  // hydrate from API, but always ensure at least one item
  useEffect(() => {
    if (!data) return;

    reset({
      education:
        data.education && data.education.length > 0
          ? data.education.map((edu: any) => ({
              degree: edu.degree ?? "",
              fieldOfStudy: edu.fieldOfStudy ?? "",
              institution: edu.institution ?? "",
              location: edu.location ?? "",
              graduationDate: edu.graduationDate ?? "",
              grade: edu.grade ?? "",
              gradingScale: edu.gradingScale ?? "",
              honors: edu.honors ?? "",
            }))
          : [
              {
                degree: "",
                fieldOfStudy: "",
                institution: "",
                location: "",
                graduationDate: "",
                grade: "",
                gradingScale: "",
                honors: "",
              },
            ],
    });
  }, [data, reset]);

  const onSubmit = (values: EducationFormValues) => {
    mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATUS, id] });
      },
    });
  };

  const watchedEducation = useWatch({
    control,
    name: "education",
  });
  const last = watchedEducation?.[watchedEducation.length - 1];
  const requiredFilledForLast =
    !!last &&
    last.degree?.trim() &&
    last.fieldOfStudy?.trim() &&
    last.institution?.trim() &&
    last.location?.trim() &&
    last.graduationDate?.trim();
  return (
    <>
      <SectionWrapper
        id="education"
        title="Education"
        description="Add your degrees and relevant academic qualifications."
        status={
          <StatusBedge
            isReady={isComplete}
            readyText="Complete"
            notReadyText="Incomplete"
          />
        }
      >
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 flex gap-8 flex-col"
          >
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 mb-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-sm text-muted-foreground">
                    Education {index + 1}
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setRemoveIndex(index)}
                      aria-label="Remove education"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Degree / Field of Study */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <FormField
                    control={control}
                    name={`education.${index}.degree`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Degree <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="BSc Computer Science"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`education.${index}.fieldOfStudy`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Field of Study{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Computer Science" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Institution / Location */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <FormField
                    control={control}
                    name={`education.${index}.institution`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Institution{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="University of Example"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`education.${index}.location`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Location <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="City, Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Graduation date / Grade / Scale */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <FormField
                    control={control}
                    name={`education.${index}.graduationDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Graduation Date{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <MonthYearPicker {...field} placeholder="MM/YYYY" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`education.${index}.grade`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 3.8 or A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`education.${index}.gradingScale`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grading Scale (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 4.0 scale" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Honors */}
                <FormField
                  control={control}
                  name={`education.${index}.honors`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Honors / Awards (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Summa Cum Laude, Dean's List"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {index < fields.length - 1 && <Separator className="mt-8" />}
              </div>
            ))}

            <div className="cv-form-actions">
              <Button
                type="button"
                variant="outline"
                disabled={!requiredFilledForLast}
                className="cv-form-primary-action"
                onClick={() =>
                  append({
                    degree: "",
                    fieldOfStudy: "",
                    institution: "",
                    location: "",
                    graduationDate: "",
                    grade: "",
                    gradingScale: "",
                    honors: "",
                  })
                }
              >
                Add another education
              </Button>
              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
                className="cv-form-primary-action"
              >
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </SectionWrapper>

      {/* Remove education confirmation dialog */}
      <RemoveEducationDialog
        open={removeIndex !== null}
        onOpenChange={(open) => {
          if (!open) setRemoveIndex(null);
        }}
        onCancel={() => setRemoveIndex(null)}
        onRemove={() => {
          if (removeIndex !== null) {
            remove(removeIndex);
            setRemoveIndex(null);
          }
        }}
      />
    </>
  );
}
