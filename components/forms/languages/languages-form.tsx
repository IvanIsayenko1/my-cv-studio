"use client";

import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronDown, Plus, Save, Trash2, X } from "lucide-react";

import SectionWrapper from "@/components/cv/cv-form-section-wrapper";
import { RemoveSkillsDialog } from "@/components/dialogs/remove-skills-dialog";
import SelectorDrawer from "@/components/dialogs/selector-drawer";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

import { useSaveLanguages } from "@/hooks/cv/use-languages";
import { useFormDirtyState } from "@/hooks/use-form-dirty-state";
import { useMediaQuery } from "@/hooks/use-media-query";

import { RESOLUTIONS } from "@/lib/constants/resolutions";

import type { BuilderFormProps } from "@/types/builder-form";
import { PROFICIENCY_OPTIONS } from "@/types/languages";

import { LanguagesFormValues, languagesSchema } from "@/schemas/languages";

const createEmptyLanguage = () => ({
  language: "",
  proficiency: "",
});

export function LanguagesForm({
  id,
  formData,
  sectionLabel,
  sectionVisible,
}: BuilderFormProps<LanguagesFormValues>) {
  const [removeLanguageIndex, setRemoveLanguageIndex] = useState<number | null>(
    null
  );
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [proficiencyPickerIndex, setProficiencyPickerIndex] = useState<
    number | null
  >(null);
  const isDesktop = useMediaQuery(RESOLUTIONS.DESKTOP);

  const { mutate, isPending } = useSaveLanguages(id);

  const form = useForm<LanguagesFormValues>({
    resolver: zodResolver(languagesSchema),
    defaultValues: {
      languages:
        formData.languages && formData.languages.length > 0
          ? formData?.languages
          : [createEmptyLanguage()],
    },
  });

  // Track unsaved changes
  useFormDirtyState("languages", form.formState.isDirty);

  const { control, formState, handleSubmit } = form;
  const isComplete = formState.isValid;

  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control,
    name: "languages",
  });

  const onSubmit = (values: LanguagesFormValues) => {
    mutate(values, {
      onSuccess: () => form.reset(values),
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

  const getSectionTitle = (index: number) => {
    return watchedLanguages[index] && watchedLanguages[index].language
      ? `${watchedLanguages[index].language}`
      : `Language ${index + 1}`;
  };

  return (
    <>
      <SectionWrapper
        sectionId="languages"
        title={sectionLabel || "Languages"}
        hiddenInPreview={sectionVisible === false}
        description="Add languages you speak and your proficiency level."
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
              {languageFields.map((field, index) => (
                <AccordionItem key={field.id} value={`item-${index}`}>
                  <AccordionTrigger>{getSectionTitle(index)}</AccordionTrigger>
                  <AccordionContent className="mb-0 max-h-none space-y-4">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <FormField
                        control={control}
                        name={`languages.${index}.language`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Language{" "}
                              <span className="text-destructive">*</span>
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
                                  onClick={() =>
                                    setProficiencyPickerIndex(index)
                                  }
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
                    {languageFields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        className="w-full"
                        onClick={() => setRemoveLanguageIndex(index)}
                        aria-label="Remove language"
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
                disabled={!canAddLanguage}
                className="cv-form-primary-action"
                onClick={() => {
                  appendLanguage(createEmptyLanguage(), { shouldFocus: false });
                  setOpenItems((prev) => [
                    ...prev,
                    `item-${languageFields.length}`,
                  ]);
                }}
              >
                <Plus />
                Add another language
              </Button>
              <Button
                type="button"
                variant="outline"
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

      <SelectorDrawer
        open={proficiencyPickerIndex !== null}
        onOpenChange={(open) => {
          if (!open) setProficiencyPickerIndex(null);
        }}
        title="Select Proficiency"
        content={PROFICIENCY_OPTIONS.map((option) => {
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
      ></SelectorDrawer>
    </>
  );
}
