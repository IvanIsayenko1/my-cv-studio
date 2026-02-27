import { z } from "zod";

export const professionalLinkSchema = z.object({
  label: z
    .string()
    .min(1, "Link label is required")
    .max(40, "Link label must be less than 40 characters"),
  url: z.string().url("Please enter a valid URL"),
});

export const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  professionalTitle: z
    .string()
    .min(1, "Professional title is required")
    .max(100, "Professional title must be less than 100 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
      "Please enter a valid phone number"
    ),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  professionalLinks: z.array(professionalLinkSchema).default([]),
  photo: z.string().optional(),
});

export type PersonalInfoFormValues = z.input<typeof personalInfoSchema>;
export type PersonalInfoParsedValues = z.output<typeof personalInfoSchema>;
