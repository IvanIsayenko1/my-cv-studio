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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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

const createEmptyLanguage = () => ({
  language: "",
  proficiency: "",
});

export function SkillsForm({ id }: SkillsFormProps) {
  const [removeCategoryIndex, setRemoveCategoryIndex] = useState<number | null>(
    null
  );
  const [removeLanguageIndex, setRemoveLanguageIndex] = useState<number | null>(
    null
  );

  const { data } = useSkills(id);
  const { mutate, isPending } = useSaveSkills(id);
  const queryClient = useQueryClient();

  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      categories: [createEmptyCategory()],
      languages: [createEmptyLanguage()],
    },
  });

  const { control, reset, formState, handleSubmit } = form;
  const { isDirty } = formState;
  const isComplete = form.formState.isValid;

  const {
    fields: categoryFields,
    append: appendCategory,
    remove: removeCategory,
  } = useFieldArray({
    control,
    name: "categories",
  });

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control,
    name: "languages",
  });

  useEffect(() => {
    if (!data) return;

    reset({
      categories:
        data?.categories?.length && data.categories.length > 0
          ? data.categories
          : [createEmptyCategory()],
      languages:
        data?.languages?.length && data.languages.length > 0
          ? data.languages
          : [createEmptyLanguage()],
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
  const watchedLanguages = useWatch({
    control,
    name: "languages",
  });

  const lastCategory = watchedCategories?.[watchedCategories.length - 1];
  const canAddCategory =
    !lastCategory ||
    (!!lastCategory.name?.trim() && !!lastCategory.items?.trim());

  const lastLanguage = watchedLanguages?.[watchedLanguages.length - 1];
  const canAddLanguage =
    !lastLanguage ||
    (!!lastLanguage.language?.trim() && !!lastLanguage.proficiency?.trim());
  return (
    <>
      <SectionWrapper
        id="skills"
        title="Skills"
        description="Add custom skill categories that match your profession."
        status={
          <StatusBedge
            isReady={isComplete}
            readyText="Complete"
            notReadyText="Incomplete"
          />
        }
      >
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {categoryFields.map((field, index) => (
              <div
                key={field.id}
                className="space-y-4 rounded-lg border p-4 pb-6"
              >
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
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              disabled={!canAddCategory}
              onClick={() => appendCategory(createEmptyCategory())}
            >
              Add another category
            </Button>

            {languageFields.map((field, index) => (
              <div
                key={field.id}
                className="space-y-4 rounded-lg border p-4 pb-6"
              >
                <div className="mb-2 flex items-start justify-between">
                  <div className="text-sm font-medium text-muted-foreground">
                    Language {index + 1}
                  </div>
                  {languageFields.length > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setRemoveLanguageIndex(index)}
                      aria-label="Remove language"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <FormField
                    control={control}
                    name={`languages.${index}.language`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Language <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="English" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`languages.${index}.proficiency`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Proficiency{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Native">Native</SelectItem>
                              <SelectItem value="Fluent">
                                Fluent / C1–C2
                              </SelectItem>
                              <SelectItem value="Advanced">
                                Advanced / B2
                              </SelectItem>
                              <SelectItem value="Intermediate">
                                Intermediate / B1
                              </SelectItem>
                              <SelectItem value="Basic">
                                Basic / A1–A2
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              disabled={!canAddLanguage}
              onClick={() => appendLanguage(createEmptyLanguage())}
            >
              Add another language
            </Button>

            <div className="cv-form-actions">
              <Button
                type="submit"
                disabled={isPending}
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

      <RemoveSkillsDialog
        open={removeLanguageIndex !== null}
        title="Remove this language?"
        description="This language entry will be permanently removed from your CV."
        onOpenChange={(open) => {
          if (!open) setRemoveLanguageIndex(null);
        }}
        onCancel={() => setRemoveLanguageIndex(null)}
        onRemove={() => {
          if (removeLanguageIndex !== null) {
            removeLanguage(removeLanguageIndex);
            setRemoveLanguageIndex(null);
          }
        }}
      />
    </>
  );
}
