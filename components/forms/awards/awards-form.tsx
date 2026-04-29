"use client";

import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Trash2, X } from "lucide-react";

import SectionWrapper from "@/components/cv/cv-form-section-wrapper";
import { RemoveAwardDialog } from "@/components/dialogs/remove-award-dialog";
import FormStatusBedge from "@/components/form-status-bedge";
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
import { Spinner } from "@/components/ui/spinner";

import { useSaveAwards } from "@/hooks/cv/use-awards";
import { useFormDirtyState } from "@/hooks/use-form-dirty-state";

import { AwardsFormValues, awardsSchema } from "@/types/awards";
import { BuilderFormProps } from "@/types/builder-form";

export function AwardsForm({
  id,
  formData,
  sectionLabel,
  sectionVisible,
}: BuilderFormProps<AwardsFormValues>) {
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const { mutate, isPending } = useSaveAwards(id);

  const form = useForm<AwardsFormValues>({
    resolver: zodResolver(awardsSchema),
    defaultValues: {
      awards: formData.awards || [],
    },
  });
  // Track unsaved changes
  useFormDirtyState("awards", form.formState.isDirty);

  const { control, handleSubmit, formState } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "awards",
  });

  const onSubmit = (values: AwardsFormValues) => {
    mutate(values, { onSuccess: () => form.reset(values) });
  };

  const watchedAwards = useWatch({
    control,
    name: "awards",
  });
  const hasAny = !!watchedAwards && watchedAwards.length > 0;
  const last = hasAny ? watchedAwards[watchedAwards.length - 1] : null;
  const lastComplete =
    !!last &&
    last.name?.trim() &&
    last.issuer?.trim() &&
    last.date?.trim() &&
    last.description?.trim();
  const canAddAward = !hasAny || lastComplete;

  const getSectionTitle = (index: number) => {
    return watchedAwards && watchedAwards[index] && watchedAwards[index].name
      ? `${watchedAwards[index].name}`
      : `Project ${index + 1}`;
  };

  return (
    <>
      <SectionWrapper
        sectionId="awards"
        title={sectionLabel || "Awards"}
        hiddenInPreview={sectionVisible === false}
        description="Add notable awards or recognitions relevant to your career."
        cvId={id}
        status={<FormStatusBedge isNotSaved={formState.isDirty} />}
      >
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            {!!fields.length && (
              <Accordion
                type="multiple"
                value={openItems}
                onValueChange={setOpenItems}
              >
                {fields.map((field, index) => (
                  <AccordionItem key={field.id} value={`item-${index}`}>
                    <AccordionTrigger>
                      {getSectionTitle(index)}
                    </AccordionTrigger>
                    <AccordionContent className="mb-0 max-h-none space-y-4">
                      {/* Name / Issuer */}
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <FormField
                          control={control}
                          name={`awards.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Award name{" "}
                                <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Best Developer Award"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name={`awards.${index}.issuer`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Issuer{" "}
                                <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Company / Organization"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Date */}
                      <FormField
                        control={control}
                        name={`awards.${index}.date`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Date (MM/YYYY){" "}
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

                      {/* Description */}
                      <FormField
                        control={control}
                        name={`awards.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Description{" "}
                              <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <RichTextEditor
                                value={field.value || ""}
                                onChange={field.onChange}
                                placeholder="Briefly describe the award and why you received it."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        variant="destructive"
                        className="w-full"
                        onClick={() => setRemoveIndex(index)}
                        aria-label="Remove award"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}

            <div className="cv-form-actions">
              <Button
                type="button"
                variant="secondary"
                className="cv-form-primary-action"
                disabled={!canAddAward}
                onClick={() => {
                  append({
                    name: "",
                    issuer: "",
                    date: "",
                    description: "",
                  });
                  setOpenItems((prev) => [...prev, `item-${fields.length}`]);
                }}
              >
                <Plus />
                {hasAny ? "Add another award" : "Add award"}
              </Button>
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
      </SectionWrapper>

      {/* Remove award confirmation dialog */}
      <RemoveAwardDialog
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
