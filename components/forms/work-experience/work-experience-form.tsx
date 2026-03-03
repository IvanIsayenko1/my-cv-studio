"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

import SectionWrapper from "@/components/cv/cv-form-section-wrapper";
import { RemoveWorkExperienceDialog } from "@/components/dialogs/remove-work-experience-dialog";
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
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import {
  useSaveWorkExperience,
  useWorkExperience,
} from "@/hooks/cv/use-work-experience";

import { QUERY_KEYS } from "@/lib/constants/query-keys";

import {
  WorkExperienceFormValues,
  workExperienceSchema,
} from "@/types/work-experience";

interface WorkExperienceFormProps {
  id: string;
}

export function WorkExperienceForm({ id }: WorkExperienceFormProps) {
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const { data } = useWorkExperience(id);
  const { mutate, isPending } = useSaveWorkExperience(id);
  const queryClient = useQueryClient();

  const form = useForm<WorkExperienceFormValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      workExperience: [
        {
          jobTitle: "",
          company: "",
          location: "",
          employmentType: "Full-time",
          startDate: "",
          endDate: "Present",
          achievements: "",
          toolsAndMethods: [],
        },
      ],
    },
  });

  const { control, reset, formState, handleSubmit } = form;
  const isComplete = form.formState.isValid;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "workExperience",
  });

  useEffect(() => {
    if (!data) return;

    reset({
      workExperience:
        data.workExperience && data.workExperience.length > 0
          ? data.workExperience
          : [
              {
                jobTitle: "",
                company: "",
                location: "",
                employmentType: "Full-time",
                startDate: "",
                endDate: "Present",
                achievements: "",
                toolsAndMethods: [],
              },
            ],
    });
  }, [data, reset]);

  const onSubmit = (values: WorkExperienceFormValues) => {
    debugger;
    mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATUS, id] });
      },
    });
  };

  // Watch all workExperience items for "can add another role" logic
  const watchedExperiences = useWatch({
    control,
    name: "workExperience",
  });

  const last = watchedExperiences?.[watchedExperiences.length - 1];
  const requiredFilledForLast =
    !!last &&
    last.jobTitle?.trim() &&
    last.company?.trim() &&
    last.location?.trim() &&
    last.startDate?.trim() &&
    last.endDate?.trim();
  return (
    <>
      <SectionWrapper
        sectionId="work-experience"
        title="Work Experience"
        description="Add your recent roles, focusing on achievements and impact."
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
            className="space-y-8 flex gap-8 flex-col"
          >
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4 mb-0">
                {/* Top row with title and delete button */}
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-sm text-muted-foreground">
                    Role {index + 1}
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setRemoveIndex(index)}
                      aria-label="Remove role"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Job title / company */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <FormField
                    control={control}
                    name={`workExperience.${index}.jobTitle`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Job Title <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Senior Frontend Developer"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`workExperience.${index}.company`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Company <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Location / Employment Type */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <FormField
                    control={control}
                    name={`workExperience.${index}.location`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Location <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Remote / City, Country"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`workExperience.${index}.employmentType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Employment Type{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Full-time">
                                Full-time
                              </SelectItem>
                              <SelectItem value="Part-time">
                                Part-time
                              </SelectItem>
                              <SelectItem value="Contract">Contract</SelectItem>
                              <SelectItem value="Freelance">
                                Freelance
                              </SelectItem>
                              <SelectItem value="Internship">
                                Internship
                              </SelectItem>
                              <SelectItem value="Temporary">
                                Temporary
                              </SelectItem>
                              <SelectItem value="Seasonal">Seasonal</SelectItem>
                              <SelectItem value="Apprenticeship">
                                Apprenticeship
                              </SelectItem>
                              <SelectItem value="Volunteer">
                                Volunteer
                              </SelectItem>
                              <SelectItem value="Self-employed">
                                Self-employed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <FormField
                    control={control}
                    name={`workExperience.${index}.startDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Start Date (MM/YYYY){" "}
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
                    name={`workExperience.${index}.endDate`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          End Date (MM/YYYY or Present){" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <MonthYearPicker
                            {...field}
                            placeholder="MM/YYYY"
                            includePresentOption={true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Achievements */}
                <FormField
                  control={control}
                  name={`workExperience.${index}.achievements`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Achievements</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Describe your key achievements and responsibilities in this role..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tools / Systems / Methods */}
                <FormField
                  control={control}
                  name={`workExperience.${index}.toolsAndMethods`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tools / Systems / Methods</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {field.value?.map((tech, i) => (
                              <span
                                key={tech + i}
                                className="inline-flex min-h-9 items-center rounded-full border px-3 py-1.5 text-sm sm:min-h-7 sm:px-2 sm:py-1 sm:text-xs"
                              >
                                {tech}
                                <button
                                  type="button"
                                  className="-mr-1 ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive sm:h-5 sm:w-5"
                                  aria-label={`Remove tool/method ${tech}`}
                                  onClick={() =>
                                    field.onChange(
                                      (field.value ?? []).filter(
                                        (_, idx) => idx !== i
                                      )
                                    )
                                  }
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                          <Input
                            placeholder="Type a tool, system, or method and press Enter"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const input = (
                                  e.target as HTMLInputElement
                                ).value.trim();
                                if (!input) return;
                                field.onChange([...(field.value ?? []), input]);
                                (e.target as HTMLInputElement).value = "";
                              }
                            }}
                          />
                        </div>
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
                className="cv-form-primary-action"
                disabled={!requiredFilledForLast}
                onClick={() =>
                  append({
                    jobTitle: "",
                    company: "",
                    location: "",
                    employmentType: "Full-time",
                    startDate: "",
                    endDate: "Present",
                    achievements: "",
                    toolsAndMethods: [],
                  })
                }
              >
                Add another role
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

      {/* Remove role confirmation dialog */}
      <RemoveWorkExperienceDialog
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
