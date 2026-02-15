"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useEducation, useSaveEducation } from "@/hooks/cv/use-education";

import { QUERY_KEYS } from "@/lib/constants/query-keys";

import { EducationFormValues, educationSchema } from "@/types/education";

interface EducationFormProps {
  setIsDirtyForm: (isDirty: boolean) => void;
  id: string;
}

export function EducationForm({ setIsDirtyForm, id }: EducationFormProps) {
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
          gpa: undefined,
          honors: "",
        },
      ],
    },
  });

  const { control, reset, formState, handleSubmit } = form;
  const { isDirty } = formState;

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
              gpa: edu.gpa ?? undefined,
              honors: edu.honors ?? "",
            }))
          : [
              {
                degree: "",
                fieldOfStudy: "",
                institution: "",
                location: "",
                graduationDate: "",
                gpa: undefined,
                honors: "",
              },
            ],
    });

    setIsDirtyForm(false);
  }, [data, reset, setIsDirtyForm]);

  useEffect(() => {
    setIsDirtyForm(isDirty);
  }, [isDirty, setIsDirtyForm]);

  const onSubmit = (values: EducationFormValues) => {
    mutate(values, {
      onSuccess: () => {
        setIsDirtyForm(false);
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
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
          <CardDescription>
            Add your degrees and relevant academic qualifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-4 border rounded-lg p-4 pb-6"
                >
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  {/* Graduation date / GPA */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <Input placeholder="06/2024" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`education.${index}.gpa`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GPA (optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="3.8"
                              value={
                                field.value === undefined
                                  ? ""
                                  : String(field.value)
                              }
                              onChange={(e) => {
                                const v = e.target.value;
                                field.onChange(
                                  v === "" ? undefined : Number(v)
                                );
                              }}
                            />
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
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                disabled={!requiredFilledForLast}
                onClick={() =>
                  append({
                    degree: "",
                    fieldOfStudy: "",
                    institution: "",
                    location: "",
                    graduationDate: "",
                    gpa: undefined,
                    honors: "",
                  })
                }
              >
                Add another education
              </Button>

              <div className="flex justify-end gap-3">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Remove education confirmation dialog */}
      <AlertDialog
        open={removeIndex !== null}
        onOpenChange={(open) => {
          if (!open) setRemoveIndex(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this education?</AlertDialogTitle>
            <AlertDialogDescription>
              This education entry will be permanently removed from your CV. You
              can add it again later if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRemoveIndex(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (removeIndex !== null) {
                  remove(removeIndex);
                  setRemoveIndex(null);
                }
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
