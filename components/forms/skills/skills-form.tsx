"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

import SectionWrapper from "@/components/cv/cv-form-section-wrapper";
import { RemoveSkillsDialog } from "@/components/dialogs/remove-skills-dialog";
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
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Separator } from "@/components/ui/separator";

import { useSaveSkills, useSkills } from "@/hooks/cv/use-skills";

import { QUERY_KEYS } from "@/lib/constants/query-keys";

import { SkillsFormValues, skillsSchema } from "@/types/skills";

interface SkillsFormProps {
  id: string;
}

const createEmptyCategory = () => ({
  name: "",
  items: "",
});

export function SkillsForm({ id }: SkillsFormProps) {
  const [removeCategoryIndex, setRemoveCategoryIndex] = useState<number | null>(
    null
  );

  const { data } = useSkills(id);
  const { mutate, isPending } = useSaveSkills(id);
  const queryClient = useQueryClient();

  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      categories: [createEmptyCategory()],
    },
  });

  const { control, reset, formState, handleSubmit } = form;
  const isComplete = formState.isValid;

  const {
    fields: categoryFields,
    append: appendCategory,
    remove: removeCategory,
  } = useFieldArray({
    control,
    name: "categories",
  });

  useEffect(() => {
    if (!data) return;

    reset({
      categories:
        data?.categories?.length && data.categories.length > 0
          ? data.categories
          : [createEmptyCategory()],
    });
  }, [data, reset]);

  const onSubmit = (values: SkillsFormValues) => {
    mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATUS, id] });
      },
    });
  };

  const watchedCategories = useWatch({
    control,
    name: "categories",
  });

  const lastCategory = watchedCategories?.[watchedCategories.length - 1];
  const canAddCategory =
    !lastCategory ||
    (!!lastCategory.name?.trim() && !!lastCategory.items?.trim());

  return (
    <>
      <SectionWrapper
        sectionId="skills"
        title="Skills"
        description="Add custom skill categories that match your profession."
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
            {categoryFields.map((field, index) => (
              <div key={field.id} className="space-y-4 mb-0">
                <div className="mb-2 flex items-start justify-between">
                  <div className="text-sm font-medium text-muted-foreground">
                    Category {index + 1}
                  </div>
                  {categoryFields.length > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setRemoveCategoryIndex(index)}
                      aria-label="Remove category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <FormField
                  control={control}
                  name={`categories.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Category name{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Clinical Skills, Sales Skills, Laboratory Skills"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`categories.${index}.items`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Items <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <RichTextEditor
                          placeholder="Use one line per item"
                          value={field.value}
                          onChange={field.onChange}
                          mode="list-only"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {index < categoryFields.length - 1 && (
                  <Separator className="mt-8" />
                )}
              </div>
            ))}

            <div className="cv-form-actions">
              <Button
                type="button"
                variant="outline"
                disabled={!canAddCategory}
                className="cv-form-primary-action"
                onClick={() => appendCategory(createEmptyCategory())}
              >
                Add another category
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

      <RemoveSkillsDialog
        open={removeCategoryIndex !== null}
        title="Remove this category?"
        description="This category will be permanently removed from your CV."
        onOpenChange={(open) => {
          if (!open) setRemoveCategoryIndex(null);
        }}
        onCancel={() => setRemoveCategoryIndex(null)}
        onRemove={() => {
          if (removeCategoryIndex !== null) {
            removeCategory(removeCategoryIndex);
            setRemoveCategoryIndex(null);
          }
        }}
      />
    </>
  );
}
