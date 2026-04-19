"use client";

import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronDown, Plus, Save, Trash2 } from "lucide-react";

import CVBuilderAIAssistant from "@/components/cv/cv-builder-ai-assistant/cv-builder-ai-assistant";
import SectionWrapper from "@/components/cv/cv-form-section-wrapper";
import { RemoveWorkExperienceDialog } from "@/components/dialogs/remove-work-experience-dialog";
import SelectorDrawer from "@/components/dialogs/selector-drawer";
import WorkExperienceAIAssistantDialog from "@/components/dialogs/work-experience-ai-assistant-dialog";
import FormStatusBedge from "@/components/form-status-bedge";
import SectionRequieredsBedge from "@/components/section-requiered-bedge";
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
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

import { useSaveWorkExperience } from "@/hooks/cv/use-work-experience";
import { useMediaQuery } from "@/hooks/use-media-query";

import { WORK_EXPERIENCE_MODULE } from "@/lib/constants/ai-prompts";
import { RESOLUTIONS } from "@/lib/constants/resolutions";

import {
  CVWorkExperienceAIReview,
  cvWorkExperienceAIReviewSchema,
} from "@/types/ai-work-experience-review";
import { BuilderFormProps } from "@/types/builder-form";
import { EMPLOYMENT_TYPE_OPTIONS } from "@/types/emplyment-types";
import {
  WorkExperienceFormValues,
  workExperienceSchema,
} from "@/types/work-experience";

export function WorkExperienceForm({
  id,
  formData,
}: BuilderFormProps<WorkExperienceFormValues>) {
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [employmentPickerIndex, setEmploymentPickerIndex] = useState<
    number | null
  >(null);
  const [isOpenAIAssistantDialog, setIsOpenAIAssistantDialog] = useState(false);
  const [aiReview, setAIReview] = useState<CVWorkExperienceAIReview | null>(
    null
  );
  const isDesktop = useMediaQuery(RESOLUTIONS.DESKTOP);

  const { mutate, isPending } = useSaveWorkExperience(id);

  const form = useForm<WorkExperienceFormValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      workExperience:
        formData.workExperience && formData.workExperience.length > 0
          ? formData.workExperience
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
    },
  });

  const { control, handleSubmit, formState } = form;
  const isComplete = formState.isValid;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "workExperience",
  });

  const onSubmit = (values: WorkExperienceFormValues) => {
    mutate(values, {
      onSuccess: () => form.reset(values),
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

  const getSectionTitle = (index: number) => {
    return watchedExperiences[index] &&
      watchedExperiences[index].jobTitle &&
      watchedExperiences[index].company
      ? `${watchedExperiences[index].jobTitle} @ ${watchedExperiences[index].company}`
      : `Role ${index + 1}`;
  };

  return (
    <>
      <SectionWrapper
        sectionId="work-experience"
        title="Work Experience"
        description="Add your recent roles, focusing on achievements and impact."
        cvId={id}
        status={
          <div className="space-x-2">
            <FormStatusBedge isNotSaved={formState.isDirty} />
            <SectionRequieredsBedge isReady={isComplete} />
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
                    {/* Job title / company */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <FormField
                        control={control}
                        name={`workExperience.${index}.jobTitle`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Job Title{" "}
                              <span className="text-destructive">*</span>
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
                              Company{" "}
                              <span className="text-destructive">*</span>
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
                              Location{" "}
                              <span className="text-destructive">*</span>
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
                              Employment Type
                              <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              {isDesktop ? (
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                                      <SelectItem key={option} value={option}>
                                        {option}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <Button
                                  type="button"
                                  variant="secondary"
                                  className="bg-input/50 w-full justify-between px-3 text-base md:text-sm"
                                  onClick={() =>
                                    setEmploymentPickerIndex(index)
                                  }
                                  aria-label="Choose employment type"
                                >
                                  <span className="truncate text-left">
                                    {field.value || "Select type"}
                                  </span>
                                  <ChevronDown className="size-4 opacity-70" />
                                </Button>
                              )}
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
                              key={index}
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
                                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive -mr-1 ml-1 inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors sm:h-5 sm:w-5"
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
                                    field.onChange([
                                      ...(field.value ?? []),
                                      input,
                                    ]);
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

                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        className="w-full"
                        onClick={() => setRemoveIndex(index)}
                        aria-label="Remove role"
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
                className="cv-form-primary-action"
                disabled={!requiredFilledForLast}
                onClick={() => {
                  append({
                    jobTitle: "",
                    company: "",
                    location: "",
                    employmentType: "Full-time",
                    startDate: "",
                    endDate: "Present",
                    achievements: "",
                    toolsAndMethods: [],
                  });
                  setOpenItems((prev) => [...prev, `item-${fields.length}`]);
                }}
              >
                <Plus />
                {!fields.length ? "Add role" : "Add another role"}
              </Button>

              <CVBuilderAIAssistant<CVWorkExperienceAIReview>
                value={form.getValues()}
                prompt={WORK_EXPERIENCE_MODULE}
                responseSchema={cvWorkExperienceAIReviewSchema}
                handleResponse={(response) => {
                  if (!response) return;
                  setAIReview(response);
                  setIsOpenAIAssistantDialog(true);
                }}
                disabled={!isComplete || isPending}
              />
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

      <WorkExperienceAIAssistantDialog
        isOpenDialog={isOpenAIAssistantDialog}
        setIsOpenDialog={setIsOpenAIAssistantDialog}
        aiReview={aiReview}
        formId={id}
        currentValues={{
          workExperience: watchedExperiences ?? [],
        }}
        onLocalApplySuggestion={(roleIndex, achievements) => {
          form.setValue(
            `workExperience.${roleIndex}.achievements`,
            achievements,
            {
              shouldDirty: true,
              shouldTouch: true,
            }
          );
        }}
      />

      <SelectorDrawer
        open={employmentPickerIndex !== null}
        onOpenChange={(open) => {
          if (!open) setEmploymentPickerIndex(null);
        }}
        title="Select Employment Type"
        content={EMPLOYMENT_TYPE_OPTIONS.map((option) => {
          const selected =
            employmentPickerIndex !== null &&
            form.getValues(
              `workExperience.${employmentPickerIndex}.employmentType`
            ) === option;

          return (
            <Button
              key={option}
              type="button"
              variant={selected ? "default" : "ghost"}
              size="lg"
              className="h-12 w-full justify-between px-4 text-left"
              onClick={() => {
                if (employmentPickerIndex === null) return;
                form.setValue(
                  `workExperience.${employmentPickerIndex}.employmentType`,
                  option,
                  { shouldDirty: true, shouldTouch: true }
                );
                setEmploymentPickerIndex(null);
              }}
            >
              <span>{option}</span>
              {selected ? <Check className="size-4" /> : null}
            </Button>
          );
        })}
      />
    </>
  );
}
