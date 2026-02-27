"use client";

import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

import SectionWrapper from "@/components/cv/cv-form-section-wrapper";
import StatusBedge from "@/components/status-bedge";
import { Button } from "@/components/ui/button";
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

import {
  usePersonalInfo,
  useSavePersonalInfo,
} from "@/hooks/cv/use-personal-info";

import { QUERY_KEYS } from "@/lib/constants/query-keys";

import {
  PersonalInfoFormValues,
  personalInfoSchema,
} from "@/types/personal-info";

export function PersonalInfoForm({ id }: { id: string }) {
  const { data } = usePersonalInfo(id);
  const { mutate, isPending } = useSavePersonalInfo(id);
  const queryClient = useQueryClient();

  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      professionalTitle: "",
      email: "",
      phone: "",
      city: "",
      country: "",
      professionalLinks: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "professionalLinks",
  });

  const isComplete = form.formState.isValid;

  useEffect(() => {
    if (data) {
      form.reset({
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
        professionalTitle: data.professionalTitle ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        city: data.city ?? "",
        country: data.country ?? "",
        professionalLinks:
          data.professionalLinks && data.professionalLinks.length > 0
            ? data.professionalLinks
            : [],
      });
    }
  }, [data, form]);

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
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATUS, id] });
      },
    });
  };

  return (
    <SectionWrapper
      id="personal-info"
      title="Personal Information"
      description="Enter your basic contact information. This will appear at the top of your CV"
      status={
        <StatusBedge
          isReady={isComplete}
          readyText="Complete"
          notReadyText="Incomplete"
        />
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          <div className="space-y-4 rounded-lg border border-border/70 bg-muted/20 p-4">
            <h3 className="text-sm font-medium text-foreground">
              Professional Links
            </h3>
            <FormDescription>
              Add any relevant links (LinkedIn, portfolio, Dribbble, Behance,
              publications, etc.).
            </FormDescription>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="space-y-3 rounded-md border border-border/70 p-3"
              >
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_2fr_auto]">
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
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              disabled={!isLastProfessionaLinkFilled}
              onClick={() => append({ label: "", url: "" })}
            >
              Add another link
            </Button>
          </div>

          <div className="cv-form-actions">
            <Button
              type="submit"
              disabled={isPending}
              className="cv-form-primary-action"
            >
              {isPending && <Spinner />}
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </SectionWrapper>
  );
}
