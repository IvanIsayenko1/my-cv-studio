"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  TemplateDescription,
  TemplateFormValues,
  TemplateId,
  TemplateName,
  templateSchema,
} from "@/types/template";
import { fetchTemplate, postTemplate } from "@/lib/fetches/template-fetches";
import { cn } from "@/lib/utils";
import TemplateFormSkeleton from "./template-form-skeleton";

interface TemplateFormProps {
  id: string;
  setIsDirtyForm: (dirty: boolean) => void;
}

export function TemplateForm({ id, setIsDirtyForm }: TemplateFormProps) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<TemplateFormValues | null>({
    queryKey: ["template", id],
    queryFn: () => fetchTemplate(id),
  });

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      id: TemplateId.ATS_FRIENDLY_CLEAN,
    },
  });

  const { control, handleSubmit, reset, formState } = form;
  const { isDirty, isSubmitting } = formState;

  useEffect(() => {
    if (!data) return;
    reset({ id: data.id ?? TemplateId.ATS_FRIENDLY_CLEAN });
    setIsDirtyForm(false);
  }, [data, reset, setIsDirtyForm]);

  useEffect(() => {
    setIsDirtyForm(isDirty);
  }, [isDirty, setIsDirtyForm]);

  const mutation = useMutation({
    mutationKey: ["template", id],
    mutationFn: (values: TemplateFormValues) => postTemplate(id, values),
    onSuccess: () => {
      toast.success("Template has been updated");
      queryClient.invalidateQueries({ queryKey: ["template", id] });
      setIsDirtyForm(false);
    },
  });

  const onSubmit = (values: TemplateFormValues) => {
    mutation.mutate(values);
  };

  if (isLoading && !data) {
    return <TemplateFormSkeleton />;
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-base sm:text-lg">Template</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Choose a template for your CV. You can change this anytime.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
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
                                    "border-2 rounded-lg transition-colors",
                                    field.value === tpl
                                      ? "border-primary ring-2 ring-primary/40"
                                      : "border-muted hover:border-primary/40"
                                  )}
                                >
                                  <CardContent className="flex aspect-[3/4] items-center justify-center p-4 sm:p-6">
                                    <span className="text-lg sm:text-2xl font-semibold">
                                      {index + 1}
                                    </span>
                                  </CardContent>
                                  <CardHeader className="space-y-1">
                                    <CardTitle className="text-center text-sm font-medium">
                                      {
                                        TemplateName[
                                          tpl as keyof typeof TemplateName
                                        ]
                                      }
                                    </CardTitle>
                                    <CardDescription className="text-center text-xs font-medium">
                                      {
                                        TemplateDescription[
                                          tpl as keyof typeof TemplateDescription
                                        ]
                                      }
                                    </CardDescription>
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
                        <CarouselNext
                          className="hidden sm:flex"
                          type="button"
                        />
                      </Carousel>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 sm:gap-3">
              <Button
                type="submit"
                size="sm"
                className="sm:h-9 sm:px-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
