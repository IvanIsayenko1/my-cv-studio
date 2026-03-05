"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Check, ChevronDown, Trash2 } from "lucide-react";

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
import {
  MobileOverlay,
  MobileOverlayBody,
  MobileOverlayClose,
  MobileOverlayContent,
  MobileOverlayFooter,
  MobileOverlayHeader,
  MobileOverlayTitle,
} from "@/components/ui/mobile-overlay";

import { useLanguages, useSaveLanguages } from "@/hooks/cv/use-languages";
import { useMediaQuery } from "@/hooks/use-media-query";

import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { RESOLUTIONS } from "@/lib/constants/resolutions";

import { LanguagesFormValues, languagesSchema } from "@/schemas/languages";

interface LanguagesFormProps {
  id: string;
}

const createEmptyLanguage = () => ({
  language: "",
  proficiency: "",
});

const PROFICIENCY_OPTIONS = [
  { value: "Native", label: "Native" },
  { value: "Fluent", label: "Fluent / C1–C2" },
  { value: "Advanced", label: "Advanced / B2" },
  { value: "Intermediate", label: "Intermediate / B1" },
  { value: "Basic", label: "Basic / A1–A2" },
] as const;

export function LanguagesForm({ id }: LanguagesFormProps) {
  const [removeLanguageIndex, setRemoveLanguageIndex] = useState<number | null>(
    null
  );
  const [proficiencyPickerIndex, setProficiencyPickerIndex] = useState<
    number | null
  >(null);
  const isDesktop = useMediaQuery(RESOLUTIONS.DESKTOP);

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
                          {isDesktop ? (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                              <SelectContent>
                                {PROFICIENCY_OPTIONS.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              className="h-11 w-full justify-between px-3"
                              onClick={() => setProficiencyPickerIndex(index)}
                              aria-label="Choose language proficiency"
                            >
                              <span className="truncate text-left">
                                {PROFICIENCY_OPTIONS.find(
                                  (option) => option.value === field.value
                                )?.label || "Select level"}
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

      <MobileOverlay
        open={proficiencyPickerIndex !== null}
        onOpenChange={(open) => {
          if (!open) setProficiencyPickerIndex(null);
        }}
      >
        <MobileOverlayContent>
          <MobileOverlayHeader>
            <MobileOverlayTitle>Select Proficiency</MobileOverlayTitle>
          </MobileOverlayHeader>
          <MobileOverlayBody className="max-h-[55vh] space-y-1">
            {PROFICIENCY_OPTIONS.map((option) => {
              const selected =
                proficiencyPickerIndex !== null &&
                form.getValues(
                  `languages.${proficiencyPickerIndex}.proficiency`
                ) === option.value;

              return (
                <Button
                  key={option.value}
                  type="button"
                  variant={selected ? "secondary" : "ghost"}
                  size="lg"
                  className="h-12 w-full justify-between px-4 text-left"
                  onClick={() => {
                    if (proficiencyPickerIndex === null) return;
                    form.setValue(
                      `languages.${proficiencyPickerIndex}.proficiency`,
                      option.value,
                      {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      }
                    );
                    setProficiencyPickerIndex(null);
                  }}
                >
                  <span>{option.label}</span>
                  {selected ? <Check className="size-4" /> : null}
                </Button>
              );
            })}
          </MobileOverlayBody>
          <MobileOverlayFooter>
            <MobileOverlayClose asChild>
              <Button type="button" variant="outline" size="lg" className="w-full">
                Close
              </Button>
            </MobileOverlayClose>
          </MobileOverlayFooter>
        </MobileOverlayContent>
      </MobileOverlay>
    </>
  );
}
