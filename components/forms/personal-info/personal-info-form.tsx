"use client";

import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Trash2 } from "lucide-react";

import CVBuilderAIAssistant from "@/components/cv/cv-builder-ai-assistant/cv-builder-ai-assistant";
import SectionWrapper from "@/components/cv/cv-form-section-wrapper";
import PersonalInfoAIAssistantDialog from "@/components/dialogs/personal-info-ai-assitant-dialog";
import FormStatusBedge from "@/components/form-status-bedge";
import SectionRequieredsBedge from "@/components/section-requiered-bedge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import { useSavePersonalInfo } from "@/hooks/cv/use-personal-info";

import { PROFESSIONAL_INFORMATION_MODULE } from "@/lib/constants/ai-prompts";

import {
  CVPersonalInformationAIReview,
  cvPersonalInformationAIReviewSchema,
} from "@/types/ai-personal-information-review";
import { BuilderFormProps } from "@/types/builder-form";
import {
  PersonalInfoFormValues,
  personalInfoSchema,
} from "@/types/personal-info";

export function PersonalInfoForm({
  id,
  formData,
}: BuilderFormProps<PersonalInfoFormValues>) {
  const { mutate, isPending } = useSavePersonalInfo(id);

  const [isOpenAIAssistantDialog, setIsOpenAIAssistantDialog] = useState(false);
  const [aiReview, setAIReview] =
    useState<CVPersonalInformationAIReview | null>(null);

  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    mode: "onTouched",
    defaultValues: {
      firstName: formData?.firstName || "",
      lastName: formData?.lastName || "",
      professionalTitle: formData?.professionalTitle || "",
      email: formData?.email || "",
      phone: formData?.phone || "",
      city: formData?.city || "",
      country: formData?.country || "",
      professionalLinks: formData?.professionalLinks || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "professionalLinks",
  });

  const isComplete = form.formState.isValid;

  const watchedProfessionalLinks = useWatch({
    control: form.control,
    name: "professionalLinks",
  });
  const last = watchedProfessionalLinks?.[watchedProfessionalLinks.length - 1];
  const isLastProfessionaLinkFilled = last
    ? !!last && !!last.label.trim() && !!last.url.trim()
    : true;

  const onSubmit = async (values: PersonalInfoFormValues) => {
    mutate(values, {
      onSuccess: () => form.reset(values),
    });
  };

  return (
    <SectionWrapper
      sectionId="personal-info"
      title="Personal Information"
      description="Enter your basic contact information. This will appear at the top of your CV"
      cvId={id}
      status={
        <div className="space-x-2">
          <FormStatusBedge isNotSaved={form.formState.isDirty} />
          <SectionRequieredsBedge isReady={isComplete} />
        </div>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          {/* Name Section */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John"
                      autoComplete="given-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Doe"
                      autoComplete="family-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Professional Title */}
          <FormField
            control={form.control}
            name="professionalTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Professional Title <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Software Engineer, Marketing Manager, Civil Engineer"
                    autoComplete="organization-title"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Use a standard job title that matches your target role
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contact Information */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      autoComplete="email"
                      inputMode="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone Number <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      autoComplete="tel"
                      inputMode="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    City <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="San Francisco"
                      autoComplete="address-level2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Country <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="United States"
                      autoComplete="country-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Optional Links */}
          <Card>
            <CardHeader>
              <CardTitle> Professional Links</CardTitle>
              <CardDescription>
                Add any relevant links (LinkedIn, portfolio, Dribbble, Behance,
                publications, etc.).
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {fields.map((field, index) => (
                <Card key={field.id}>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_2fr_auto] lg:items-end">
                      <FormField
                        control={form.control}
                        name={`professionalLinks.${index}.label`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                              <Input placeholder="LinkedIn" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`professionalLinks.${index}.url`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/profile"
                                autoComplete="url"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-end">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => remove(index)}
                          aria-label="Remove link"
                          disabled={fields.length === 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
            <CardFooter className="cv-form-actions">
              <Button
                type="button"
                variant="outline"
                disabled={!isLastProfessionaLinkFilled}
                onClick={() => append({ label: "", url: "" })}
                className="cv-form-primary-action"
              >
                {!fields.length ? "Add link" : "Add another link"}
              </Button>
            </CardFooter>
          </Card>

          <div className="cv-form-actions">
            <CVBuilderAIAssistant<CVPersonalInformationAIReview>
              disabled={!isComplete || isPending}
              value={form.getValues()}
              prompt={PROFESSIONAL_INFORMATION_MODULE}
              responseSchema={cvPersonalInformationAIReviewSchema}
              handleResponse={(e) => {
                setAIReview(e);
                setIsOpenAIAssistantDialog(true);
              }}
            />
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

      {/* AI Assistant Dialog */}
      <PersonalInfoAIAssistantDialog
        isOpenDialog={isOpenAIAssistantDialog}
        setIsOpenDialog={setIsOpenAIAssistantDialog}
        aiReview={aiReview}
        formId={id}
      />
    </SectionWrapper>
  );
}
