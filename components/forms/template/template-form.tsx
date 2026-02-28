"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";

import SectionWrapper from "@/components/cv/cv-form-section-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  useEffect(() => {
    if (!data) return;
    reset({ id: data.id ?? TemplateId.ATS_FRIENDLY_CLEAN });
  }, [data, reset]);

  const onSubmit = (values: TemplateFormValues) => {
    mutate(values);
  };

  return (
    <SectionWrapper
      id="template"
      title="Template"
      description="Choose a template for your CV. You can change this anytime."
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
                  <div className="flex flex-col items-center gap-4">
                    <Carousel className="w-full sm:w-5/6">
                      <CarouselContent className="-ml-1">
                        {Object.values(TemplateId).map((tpl, index) => (
                          <CarouselItem
                            key={tpl}
                            className="pl-1 basis-full sm:basis-1/2 lg:basis-1/3"
                          >
                            <button
                              type="button"
                              onClick={() => field.onChange(tpl)}
                              className="w-full p-1 focus:outline-none"
                            >
                              <Card
                                className={cn(
                                  "border-2 transition-colors pt-0",
                                  field.value === tpl
                                    ? "border-primary ring-2 ring-primary/40"
                                    : "border-muted hover:border-primary/40"
                                )}
                              >
                                <CardContent className="relative aspect-[3/4]">
                                  <Image
                                    src={`/cv-templates/${tpl}.webp`}
                                    alt={tpl}
                                    className="rounded-lg"
                                    fill
                                    sizes="(max-width: 640px) 100vw, 33vw"
                                  />
                                  {/* <span className="text-lg sm:text-2xl font-semibold">
                                      {index + 1}
                                    </span> */}
                                </CardContent>
                                <CardHeader className="space-y-1">
                                  <CardTitle className="text-center text-sm font-medium">
                                    {
                                      TemplateName[
                                        tpl as keyof typeof TemplateName
                                      ]
                                    }
                                  </CardTitle>
                                </CardHeader>
                              </Card>
                            </button>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {/* Hide arrows on mobile, show from sm+ */}
                      <CarouselPrevious
                        className="hidden sm:flex"
                        type="button"
                      />
                      <CarouselNext className="hidden sm:flex" type="button" />
                    </Carousel>
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
