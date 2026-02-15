import { z } from "zod";

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
  linkedIn: z
    .string()
    .url("Please enter a valid LinkedIn URL")
    .optional()
    .or(z.literal("")),
  portfolio: z
    .string()
    .url("Please enter a valid portfolio URL")
    .optional()
    .or(z.literal("")),
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;
