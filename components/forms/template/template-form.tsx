"use client";

import { useForm } from "react-hook-form";

import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";

import SectionWrapper from "@/components/cv/cv-form-section-wrapper";
import FormStatusBedge from "@/components/form-status-bedge";
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
  FormMessage,
} from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";

import { useSaveTemplate } from "@/hooks/cv/use-template";
import { useFormDirtyState } from "@/hooks/use-form-dirty-state";

import { cn } from "@/lib/utils/cn";

import { BuilderFormProps } from "@/types/builder-form";
import {
  TEMPLATE_OPTIONS,
  TemplateFormValues,
  TemplateId,
  templateSchema,
} from "@/types/template";

export function TemplateForm({
  id,
  formData,
}: BuilderFormProps<TemplateFormValues>) {
  const { mutate, isPending } = useSaveTemplate(id);

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      id: formData?.id || TemplateId.ATS_FRIENDLY_SIMPLE,
      accentColor: formData?.accentColor || "#3B82F6",
    },
  });
  // Track unsaved changes
  useFormDirtyState("template", form.formState.isDirty);

  const { control, handleSubmit, formState } = form;

  const onSubmit = (values: TemplateFormValues) => {
    mutate(values, { onSuccess: () => form.reset(values) });
  };

  return (
    <SectionWrapper
      sectionId="template"
      title="Template"
      description="Choose a template for your CV. You can change this anytime."
      cvId={id}
      status={<FormStatusBedge isNotSaved={formState.isDirty} />}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid w-full grid-cols-1 gap-2 p-2 sm:grid-cols-1 sm:gap-4 sm:p-4 md:grid-cols-2">
                    {TEMPLATE_OPTIONS.map((template) => (
                      <div key={template.id}>
                        <Card
                          className={cn(
                            "cursor-pointer border-2 py-2",
                            field.value === template.id
                              ? "border-primary"
                              : "border-transparent hover:border-gray-300"
                          )}
                          onClick={() => field.onChange(template.id)}
                        >
                          <CardHeader className="px-2">
                            <CardTitle>{template.name}</CardTitle>
                            <CardDescription>
                              {template.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="px-2">
                            <Image
                              src={template.previewSrc}
                              alt={`Preview of ${template.name} template`}
                              width={400}
                              height={500}
                              className="h-auto w-full rounded-2xl object-cover"
                            />
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="cv-form-actions">
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
              className="cv-form-primary-action"
              disabled={isPending}
            >
              {isPending ? <Spinner /> : <Save />}
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </SectionWrapper>
  );
}
