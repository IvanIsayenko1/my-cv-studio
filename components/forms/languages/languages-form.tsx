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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { useLanguages, useSaveLanguages } from "@/hooks/cv/use-languages";

import { QUERY_KEYS } from "@/lib/constants/query-keys";

import { SkillsFormValues, skillsSchema } from "@/types/skills";

import { LanguagesFormValues, languagesSchema } from "@/schemas/languages";

interface LanguagesFormProps {
  id: string;
}

const createEmptyLanguage = () => ({
  language: "",
  proficiency: "",
});

export function LanguagesForm({ id }: LanguagesFormProps) {
  const [removeLanguageIndex, setRemoveLanguageIndex] = useState<number | null>(
    null
  );

  const { data } = useLanguages(id);
  const { mutate, isPending } = useSaveLanguages(id);
  const queryClient = useQueryClient();

  const form = useForm<LanguagesFormValues>({
    resolver: zodResolver(languagesSchema),
    defaultValues: {
      languages: [createEmptyLanguage()],
    },
  });

  const { control, reset, formState, handleSubmit } = form;
  const isComplete = formState.isValid;

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
      languages:
        data?.languages?.length && data.languages.length > 0
          ? data.languages
          : [createEmptyLanguage()],
    });
  }, [data, reset]);

  const onSubmit = (values: LanguagesFormValues) => {
    mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATUS, id] });
      },
    });
  };

  const watchedLanguages = useWatch({
    control,
    name: "languages",
  });

  const lastLanguage = watchedLanguages?.[watchedLanguages.length - 1];
  const canAddLanguage =
    !lastLanguage ||
    (!!lastLanguage.language?.trim() && !!lastLanguage.proficiency?.trim());
  return (
    <>
      <SectionWrapper
        sectionId="languages"
        title="Languages"
        description="Add languages you speak and your proficiency level."
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
            {languageFields.map((field, index) => (
              <div key={field.id} className="space-y-4 mb-0">
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
                {index < languageFields.length - 1 && (
                  <Separator className="mt-8" />
                )}
              </div>
            ))}

            <div className="cv-form-actions">
              <Button
                type="button"
                variant="outline"
                disabled={!canAddLanguage}
                className="cv-form-primary-action"
                onClick={() => appendLanguage(createEmptyLanguage())}
              >
                Add another language
              </Button>
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
