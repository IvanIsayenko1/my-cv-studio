"use client";

import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save, Trash2, X } from "lucide-react";

import CVBuilderAIAssistant from "@/components/cv/cv-builder-ai-assistant/cv-builder-ai-assistant";
import SectionWrapper from "@/components/cv/cv-form-section-wrapper";
import { RemoveSkillsDialog } from "@/components/dialogs/remove-skills-dialog";
import SkillsAIAssistantDialog from "@/components/dialogs/skills-ai-assistant-dialog";
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
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Spinner } from "@/components/ui/spinner";

import { useSaveSkills } from "@/hooks/cv/use-skills";
import { useFormDirtyState } from "@/hooks/use-form-dirty-state";

import { SKILLS_MODULE } from "@/lib/constants/ai-prompts";

import {
  CVSkillsAIReview,
  cvSkillsAIReviewSchema,
} from "@/types/ai-skills-review";
import { BuilderFormProps } from "@/types/builder-form";
import { SkillsFormValues, skillsSchema } from "@/types/skills";

const createEmptyCategory = () => ({
  name: "",
  items: "",
});

export function SkillsForm({
  id,
  formData,
}: BuilderFormProps<SkillsFormValues>) {
  const [removeCategoryIndex, setRemoveCategoryIndex] = useState<number | null>(
    null
  );
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [isOpenAIAssistantDialog, setIsOpenAIAssistantDialog] = useState(false);
  const [aiReview, setAIReview] = useState<CVSkillsAIReview | null>(null);

  const { mutate, isPending } = useSaveSkills(id);

  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      categories:
        formData.categories && formData.categories.length > 0
          ? formData.categories
          : [createEmptyCategory()],
    },
  });

  // Track unsaved changes
  useFormDirtyState("skills", form.formState.isDirty);

  const { control, formState, handleSubmit } = form;
  const isComplete = formState.isValid;

  const {
    fields: categoryFields,
    append: appendCategory,
    remove: removeCategory,
  } = useFieldArray({
    control,
    name: "categories",
  });

  const onSubmit = (values: SkillsFormValues) => {
    mutate(values, {
      onSuccess: () => form.reset(values),
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

  const getSectionTitle = (index: number) => {
    return watchedCategories[index] && watchedCategories[index].name
      ? `${watchedCategories[index].name}`
      : `Category ${index + 1}`;
  };

  return (
    <>
      <SectionWrapper
        sectionId="skills"
        title="Skills"
        description="Add custom skill categories that match your profession."
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
              {categoryFields.map((field, index) => (
                <AccordionItem key={field.id} value={`item-${index}`}>
                  <AccordionTrigger>{getSectionTitle(index)}</AccordionTrigger>

                  <AccordionContent className="mb-0 max-h-none space-y-4">
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
                    {categoryFields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        className="w-full"
                        onClick={() => setRemoveCategoryIndex(index)}
                        aria-label="Remove caregory"
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
                disabled={!canAddCategory}
                className="cv-form-primary-action"
                onClick={() => {
                  appendCategory(createEmptyCategory());
                  setOpenItems((prev) => [
                    ...prev,
                    `item-${categoryFields.length}`,
                  ]);
                }}
              >
                <Plus />
                {!categoryFields.length
                  ? "Add category"
                  : "Add another category"}
              </Button>

              <CVBuilderAIAssistant<CVSkillsAIReview>
                value={form.getValues()}
                prompt={SKILLS_MODULE}
                responseSchema={cvSkillsAIReviewSchema}
                handleResponse={(response) => {
                  if (!response) return;
                  setAIReview(response);
                  setIsOpenAIAssistantDialog(true);
                }}
                disabled={!isComplete || isPending}
              />

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

      <SkillsAIAssistantDialog
        isOpenDialog={isOpenAIAssistantDialog}
        setIsOpenDialog={setIsOpenAIAssistantDialog}
        aiReview={aiReview}
        formId={id}
        currentValues={{
          categories: watchedCategories ?? [],
        }}
      />
    </>
  );
}
