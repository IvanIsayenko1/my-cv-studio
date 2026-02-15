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

export function SkillsForm({ setIsDirtyForm, id }: SkillsFormProps) {
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
        coreCompetencies: [],
        toolsAndTechnologies: [],
        systemsAndMethodologies: [],
        collaborationAndDelivery: [],
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

  useEffect(() => {
    if (!data) return;

    reset({
      skills: {
        coreCompetencies:
          data.skills?.coreCompetencies?.length &&
          data.skills.coreCompetencies.length > 0
            ? data.skills.coreCompetencies
            : [""],
        toolsAndTechnologies:
          data.skills?.toolsAndTechnologies?.length &&
          data.skills.toolsAndTechnologies.length > 0
            ? data.skills.toolsAndTechnologies
            : [""],
        systemsAndMethodologies:
          data.skills?.systemsAndMethodologies?.length &&
          data.skills.systemsAndMethodologies.length > 0
            ? data.skills.systemsAndMethodologies
            : [""],
        collaborationAndDelivery:
          data.skills?.collaborationAndDelivery?.length &&
          data.skills.collaborationAndDelivery.length > 0
            ? data.skills.collaborationAndDelivery
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

  const onSubmit = (values: SkillsFormValues) => {
    mutate(values, {
      onSuccess: () => {
        setIsDirtyForm(false);
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATUS, id] });
      },
    });
  };

  const watchedLanguages = useWatch({
    control,
    name: "skills.languages",
  });
  const lastLang = watchedLanguages?.[watchedLanguages.length - 1];
  const requiredFilledForLastLanguage =
    !!lastLang && lastLang.language?.trim() && lastLang.proficiency?.trim();

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
              <div className="space-y-4 border rounded-lg p-4 pb-6">
                <div className="font-medium text-sm text-muted-foreground mb-2">
                  Skills overview
                </div>

                {/* Core competencies */}
                <FormField
                  control={control}
                  name="skills.coreCompetencies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Core competencies{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Use one line per core competency"
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

                {/* Tools and technologies */}
                <FormField
                  control={control}
                  name="skills.toolsAndTechnologies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tools and technologies{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Use one line per tool and technology"
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

                {/* Systems and methodologies */}
                <FormField
                  control={control}
                  name="skills.systemsAndMethodologies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Systems and methodologies{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Use one line per system and methodology"
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

                {/* Collaboration and delivery */}
                <FormField
                  control={control}
                  name="skills.collaborationAndDelivery"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Collaboration and delivery{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Use one line per collaboration and delivery"
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
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Save"}
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
