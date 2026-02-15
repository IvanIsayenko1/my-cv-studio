"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  usePersonalInfo,
  useSavePersonalInfo,
} from "@/hooks/cv/use-personal-info";

import { QUERY_KEYS } from "@/lib/constants/query-keys";

import {
  PersonalInfoFormValues,
  personalInfoSchema,
} from "@/types/personal-info";

interface PersonalInfoFormProps {
  setIsDirtyForm: (isDirty: boolean) => void;
  id: string;
}

export function PersonalInfoForm({
  setIsDirtyForm,
  id,
}: PersonalInfoFormProps) {
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
      linkedIn: "",
      portfolio: "",
    },
  });

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
        linkedIn: data.linkedIn ?? "",
        portfolio: data.portfolio ?? "",
      });
      setIsDirtyForm(false);
    }
  }, [data, form, setIsDirtyForm]);

  const { isDirty } = form.formState;

  useEffect(() => {
    setIsDirtyForm(isDirty);
  }, [isDirty, setIsDirtyForm]);

  const onSubmit = async (values: PersonalInfoFormValues) => {
    mutate(values, {
      onSuccess: () => {
        setIsDirtyForm(false);
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATUS, id] });
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Enter your basic contact information. This will appear at the top of
          your CV.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      First Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
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
                      <Input placeholder="Doe" {...field} />
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
                    Professional Title{" "}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Software Engineer, Marketing Manager, Civil Engineer"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      City <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="San Francisco" {...field} />
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
                      <Input placeholder="United States" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Optional Links */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-medium">Optional Links</h3>
              <FormField
                control={form.control}
                name="linkedIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Profile</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://www.linkedin.com/in/johndoe"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Your LinkedIn profile URL (recommended)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="portfolio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio/Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.johndoe.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Personal website, portfolio, or GitHub profile
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
