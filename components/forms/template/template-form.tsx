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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
  TemplateFormValues,
  TemplateId,
  TemplateName,
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
  const { control, handleSubmit, reset, formState } = form;
  const { isDirty } = formState;

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
                  <div className="grid w-full gap-2 p-2 sm:gap-4 sm:p-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2">
                    {Object.values(TemplateId).map((tpl, index) => (
                      <div>
                        <Card
                          key={index}
                          className={cn(
                            "cursor-pointer border-2 py-2",
                            field.value === tpl
                              ? "border-primary"
                              : "border-transparent hover:border-gray-300"
                          )}
                          onClick={() => field.onChange(tpl)}
                        >
                          <CardHeader className="px-2">
                            <CardTitle>{TemplateName[tpl]}</CardTitle>
                            <CardDescription>
                              {`Template ${index + 1}`}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="px-2">
                            <Image
                              src={`/cv-templates/${tpl}.webp`}
                              alt={`Preview of ${TemplateName[tpl]} template`}
                              width={400}
                              height={500}
                              className="w-full h-auto object-cover rounded-md"
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
