"use client";

import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Trash2 } from "lucide-react";

import SectionWrapper from "@/components/cv/cv-form-section-wrapper";
import { RemoveEducationDialog } from "@/components/dialogs/remove-education-dialog";
import FormStatusBedge from "@/components/form-status-bedge";
import SectionStatusBedge from "@/components/section-status-bedge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Spinner } from "@/components/ui/spinner";

import { useSaveEducation } from "@/hooks/cv/use-education";

import { BuilderFormProps } from "@/types/builder-form";
import { EducationFormValues, educationSchema } from "@/types/education";

export function EducationForm({
  id,
  formData,
}: BuilderFormProps<EducationFormValues>) {
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const { mutate, isPending } = useSaveEducation(id);

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      education:
        formData.education && formData.education.length > 0
          ? formData?.education
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
    },
  });

  const { control, handleSubmit } = form;
  const isComplete = form.formState.isValid;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  const onSubmit = (values: EducationFormValues) => {
    mutate(values, {
      onSuccess: () => form.reset(values),
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

  const getSectionTitle = (index: number) => {
    return watchedEducation[index] &&
      watchedEducation[index].degree &&
      watchedEducation[index].institution
      ? `${watchedEducation[index].degree} @ ${watchedEducation[index].institution}`
      : `Education ${index + 1}`;
  };

  return (
    <>
      <SectionWrapper
        sectionId="education"
        title="Education"
        description="Add your degrees and relevant academic qualifications."
        cvId={id}
        status={
          <div className="space-x-2">
            <FormStatusBedge isNotSaved={form.formState.isDirty} />
            <SectionStatusBedge
              isReady={isComplete}
              readyText="Complete"
              notReadyText="Incomplete"
            />
          </div>
        }
      >
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            <Accordion
              type="multiple"
              value={openItems}
              onValueChange={setOpenItems}
            >
              {fields.map((field, index) => (
                <AccordionItem key={field.id} value={`item-${index}`}>
                  <AccordionTrigger>{getSectionTitle(index)}</AccordionTrigger>

                  <AccordionContent className="mb-0 max-h-none space-y-4">
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
                              <Input
                                placeholder="Computer Science"
                                {...field}
                              />
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
                              Location{" "}
                              <span className="text-destructive">*</span>
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
                              <MonthYearPicker
                                {...field}
                                placeholder="MM/YYYY"
                              />
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

                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        className="w-full"
                        onClick={() => setRemoveIndex(index)}
                        aria-label="Remove education"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="cv-form-actions">
              <Button
                type="button"
                variant="outline"
                disabled={!requiredFilledForLast}
                className="cv-form-primary-action"
                onClick={() => {
                  append({
                    degree: "",
                    fieldOfStudy: "",
                    institution: "",
                    location: "",
                    graduationDate: "",
                    grade: "",
                    gradingScale: "",
                    honors: "",
                  });
                  setOpenItems((prev) => [...prev, `item-${fields.length}`]);
                }}
              >
                <Plus />
                {!fields.length ? "Add education" : "Add another education"}
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
