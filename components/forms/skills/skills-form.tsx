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
  setIsDirtyForm: (isDirty: boolean) => void;
  id: string;
}

const createEmptyCategory = () => ({
  name: "",
  items: [""],
});

const createEmptyLanguage = () => ({
  language: "",
  proficiency: "",
});

export function SkillsForm({ setIsDirtyForm, id }: SkillsFormProps) {
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
      skills: {
        categories: [createEmptyCategory()],
        languages: [createEmptyLanguage()],
      },
    },
  });

  const { control, reset, formState, handleSubmit } = form;
  const { isDirty } = formState;

  const {
    fields: categoryFields,
    append: appendCategory,
    remove: removeCategory,
  } = useFieldArray({
    control,
    name: "skills.categories",
  });

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control,
    name: "skills.languages",
  });

  useEffect(() => {
    if (!data) return;

    reset({
      skills: {
        categories:
          data.skills?.categories?.length && data.skills.categories.length > 0
            ? data.skills.categories
            : [createEmptyCategory()],
        languages:
          data.skills?.languages?.length && data.skills.languages.length > 0
            ? data.skills.languages
            : [createEmptyLanguage()],
      },
    });

    setIsDirtyForm(false);
  }, [data, reset, setIsDirtyForm]);

  useEffect(() => {
    setIsDirtyForm(isDirty);
  }, [isDirty, setIsDirtyForm]);

  const onSubmit = (values: SkillsFormValues) => {
    mutate(values, {
      onSuccess: () => {
        setIsDirtyForm(false);
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATUS, id] });
      },
    });
  };

  const watchedCategories = useWatch({
    control,
    name: "skills.categories",
  });
  const watchedLanguages = useWatch({
    control,
    name: "skills.languages",
  });

  const lastCategory = watchedCategories?.[watchedCategories.length - 1];
  const canAddCategory =
    !lastCategory ||
    (!!lastCategory.name?.trim() &&
      (lastCategory.items ?? []).some((item) => item.trim()));

  const lastLanguage = watchedLanguages?.[watchedLanguages.length - 1];
  const canAddLanguage =
    !lastLanguage ||
    (!!lastLanguage.language?.trim() && !!lastLanguage.proficiency?.trim());

  return (
    <>
      <Card>
        <CardHeader className="px-5 sm:px-6">
          <CardTitle>Skills</CardTitle>
          <CardDescription>
            Add custom skill categories that match your profession.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 sm:px-6">
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
                    name={`skills.categories.${index}.name`}
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
                    name={`skills.categories.${index}.items`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Items <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="Use one line per item"
                            value={field.value?.join("\n") ?? ""}
                            onChange={(e) =>
                              field.onChange(e.target.value.split("\n"))
                            }
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
                      name={`skills.languages.${index}.language`}
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
                      name={`skills.languages.${index}.proficiency`}
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
        </CardContent>
      </Card>

      <AlertDialog
        open={removeCategoryIndex !== null}
        onOpenChange={(open) => {
          if (!open) setRemoveCategoryIndex(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this category?</AlertDialogTitle>
            <AlertDialogDescription>
              This category will be permanently removed from your CV.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRemoveCategoryIndex(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (removeCategoryIndex !== null) {
                  removeCategory(removeCategoryIndex);
                  setRemoveCategoryIndex(null);
                }
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={removeLanguageIndex !== null}
        onOpenChange={(open) => {
          if (!open) setRemoveLanguageIndex(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this language?</AlertDialogTitle>
            <AlertDialogDescription>
              This language entry will be permanently removed from your CV.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRemoveLanguageIndex(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (removeLanguageIndex !== null) {
                  removeLanguage(removeLanguageIndex);
                  setRemoveLanguageIndex(null);
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
