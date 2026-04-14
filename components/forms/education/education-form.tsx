"use client";

import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
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

import { useSaveEducation } from "@/hooks/cv/use-education";

import { BuilderFormProps } from "@/types/builder-form";
import { EducationFormValues, educationSchema } from "@/types/education";

export function EducationForm({
  id,
  formData,
}: BuilderFormProps<EducationFormValues>) {
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const { mutate, isPending } = useSaveEducation(id);

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education: formData?.education || [
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

  const { control, handleSubmit } = form;
  const isComplete = form.formState.isValid;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  const onSubmit = (values: EducationFormValues) => {
    mutate(values);
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
        sectionId="education"
        title="Education"
        description="Add your degrees and relevant academic qualifications."
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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8 space-y-8"
          >
            {fields.map((field, index) => (
              <div key={field.id} className="mb-0 space-y-4">
                <div className="mb-2 flex items-start justify-between">
                  <div className="text-muted-foreground text-sm font-medium">
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
