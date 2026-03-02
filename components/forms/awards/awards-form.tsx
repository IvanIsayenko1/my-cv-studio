"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";

import SectionWrapper from "@/components/cv/cv-form-section-wrapper";
import { RemoveAwardDialog } from "@/components/dialogs/remove-award-dialog";
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
import { Separator } from "@/components/ui/separator";

import { useAwards, useSaveAwards } from "@/hooks/cv/use-awards";

import { AwardsFormValues, awardsSchema } from "@/types/awards";

interface AwardsFormProps {
  id: string;
}

export function AwardsForm({ id }: AwardsFormProps) {
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const { data } = useAwards(id);
  const { mutate, isPending } = useSaveAwards(id);

  const form = useForm<AwardsFormValues>({
    resolver: zodResolver(awardsSchema),
    defaultValues: {
      awards: [],
    },
  });
  const { control, reset, formState, handleSubmit } = form;
  const { isDirty } = formState;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "awards",
  });

  useEffect(() => {
    if (!data) return;

    reset({
      awards: data.awards && data.awards.length > 0 ? data.awards : [],
    });
  }, [data, reset]);

  const onSubmit = (values: AwardsFormValues) => {
    mutate(values);
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

  return (
    <>
      <SectionWrapper
        id="awards"
        title="Awards"
        description="Add notable awards or recognitions relevant to your career."
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
                    Award {index + 1}
                  </div>
                  {fields.length > 0 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setRemoveIndex(index)}
                      aria-label="Remove award"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Name / Issuer */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <FormField
                    control={control}
                    name={`awards.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Award name <span className="text-destructive">*</span>
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
                          Issuer <span className="text-destructive">*</span>
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
                        <MonthYearPicker {...field} placeholder="MM/YYYY" />
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
                        Description <span className="text-destructive">*</span>
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

                {index < fields.length - 1 && <Separator className="mt-8" />}
              </div>
            ))}

            <div className="cv-form-actions">
              <Button
                type="button"
                variant="outline"
                className="cv-form-primary-action"
                disabled={!canAddAward}
                onClick={() =>
                  append({
                    name: "",
                    issuer: "",
                    date: "",
                    description: "",
                  })
                }
              >
                {hasAny ? "Add another award" : "Add award"}
              </Button>
              <Button
                type="submit"
                disabled={
                  isPending ||
                  !form.formState.isValid ||
                  form.formState.isDirty === false
                }
                className="cv-form-primary-action"
              >
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
