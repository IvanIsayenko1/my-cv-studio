"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SkillsFormValues, skillsSchema } from "@/types/skills";
import { fetchSkills, postSkills } from "@/lib/fetches/skills-fetches";
import { Textarea } from "./ui/textarea";
import { SkillsFormSkeleton } from "./skills-form-skeleton";

interface SkillsFormProps {
  setIsDirtyForm: (isDirty: boolean) => void;
  id: string; // cvId
}

export function SkillsForm({ setIsDirtyForm, id }: SkillsFormProps) {
  const queryClient = useQueryClient();
  const [removeLanguageIndex, setRemoveLanguageIndex] = useState<number | null>(
    null
  );

  const { data, isLoading } = useQuery<SkillsFormValues | null>({
    queryKey: ["skills", id],
    queryFn: () => fetchSkills(id),
  });

  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: {
        technical: [],
        hard: [],
        soft: [],
        languages: [
          {
            language: undefined,
            proficiency: undefined,
          },
        ],
      },
    },
  });

  const { control, reset, formState, handleSubmit } = form;
  const { isDirty } = formState;

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control,
    name: "skills.languages",
  });

  // hydrate from API, but always ensure at least one of each
  useEffect(() => {
    if (!data) return;

    reset({
      skills: {
        technical:
          data.skills?.technical?.length && data.skills.technical.length > 0
            ? data.skills.technical
            : [""],
        hard:
          data.skills?.hard?.length && data.skills.hard.length > 0
            ? data.skills.hard
            : [""],
        soft:
          data.skills?.soft?.length && data.skills.soft.length > 0
            ? data.skills.soft
            : [""],
        languages:
          data.skills?.languages?.length && data.skills.languages.length > 0
            ? data.skills.languages
            : [
                {
                  language: "",
                  proficiency: "",
                },
              ],
      },
    });

    setIsDirtyForm(false);
  }, [data, reset, setIsDirtyForm]);

  useEffect(() => {
    setIsDirtyForm(isDirty);
  }, [isDirty, setIsDirtyForm]);

  const mutation = useMutation({
    mutationKey: ["skills", id],
    mutationFn: (values: SkillsFormValues) => {
      const cleaned: SkillsFormValues = {
        skills: {
          technical: values.skills.technical
            ? values.skills.technical.map((s) => s.trim()).filter(Boolean)
            : [],
          hard: values.skills.hard
            ? values.skills.hard.map((s) => s.trim()).filter(Boolean)
            : [],
          soft: values.skills.soft
            ? values.skills.soft.map((s) => s.trim()).filter(Boolean)
            : [],
          languages: values.skills.languages
            ? values.skills.languages
                .map((l) => ({
                  language: l.language.trim(),
                  proficiency: l.proficiency,
                }))
                .filter((l) => l.language && l.proficiency)
            : [],
        },
      };
      return postSkills(id, cleaned);
    },
    onSuccess: () => {
      toast.success("Skills have been updated");
      queryClient.invalidateQueries({ queryKey: ["skills", id] });
      setIsDirtyForm(false);
    },
  });

  const onSubmit = (values: SkillsFormValues) => {
    mutation.mutate(values);
  };

  // Watch last language row for enabling "Add another language"
  const watchedLanguages = useWatch({
    control,
    name: "skills.languages",
  });
  const lastLang = watchedLanguages?.[watchedLanguages.length - 1];
  const requiredFilledForLastLanguage =
    !!lastLang && lastLang.language?.trim() && lastLang.proficiency?.trim();

  if (isLoading && !data) {
    return <SkillsFormSkeleton />;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>Add your key skills and languages.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* TECHNICAL / HARD / SOFT as chip lists */}
              <div className="space-y-4 border rounded-lg p-4 pb-6">
                <div className="font-medium text-sm text-muted-foreground mb-2">
                  Skills overview
                </div>

                {/* Technical skills */}
                <FormField
                  control={control}
                  name="skills.technical"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Technical skills{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Use one line per technical skill"
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

                {/* Hard skills */}
                <FormField
                  control={control}
                  name="skills.hard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Hard skills <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Use one line per hard skill"
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

                {/* Soft skills */}
                <FormField
                  control={control}
                  name="skills.soft"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Soft skills <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Use one line per soft skill"
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

              {/* LANGUAGES as repeatable cards, like Education entries */}
              {languageFields.map((field, index) => (
                <div
                  key={field.id}
                  className="space-y-4 border rounded-lg p-4 pb-6"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-sm text-muted-foreground">
                      Language {index + 1}
                    </div>
                    {languageFields.length > 1 && (
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setRemoveLanguageIndex(index)}
                        aria-label="Remove language"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                disabled={!requiredFilledForLastLanguage}
                onClick={() =>
                  appendLanguage({
                    language: "",
                    proficiency: "",
                  })
                }
              >
                Add another language
              </Button>

              <div className="flex justify-end gap-3">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Remove language confirmation dialog */}
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
              This language entry will be permanently removed from your CV. You
              can add it again later if needed.
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
