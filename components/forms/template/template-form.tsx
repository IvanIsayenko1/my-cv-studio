"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";

import SectionWrapper from "@/components/cv/cv-form-section-wrapper";
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

import { useSaveTemplate, useTemplate } from "@/hooks/cv/use-template";

import { cn } from "@/lib/utils/cn";

import {
  TEMPLATE_OPTIONS,
  TemplateFormValues,
  TemplateId,
  templateSchema,
} from "@/types/template";

interface TemplateFormProps {
  id: string;
}

export function TemplateForm({ id }: TemplateFormProps) {
  const { data } = useTemplate(id);
  const { mutate, isPending } = useSaveTemplate(id);

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      id: TemplateId.ATS_FRIENDLY_CLEAN,
    },
  });
  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (!data) return;
    reset({ id: data.id ?? TemplateId.ATS_FRIENDLY_CLEAN });
  }, [data, reset]);

  const onSubmit = (values: TemplateFormValues) => {
    mutate(values);
  };

  return (
    <SectionWrapper
      sectionId="template"
      title="Template"
      description="Choose a template for your CV. You can change this anytime."
      cvId={id}
    >
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
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
                              className="h-auto w-full rounded-md object-cover"
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
              type="submit"
              className="cv-form-primary-action"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </SectionWrapper>
  );
}
