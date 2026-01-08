import { z } from "zod";
import { monthYearRegex } from "./regex";

export const awardItemSchema = z.object({
  name: z.string().min(1, "Award name is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z
    .string()
    .min(1, "Date is required")
    .regex(monthYearRegex, "Use format MM/YYYY (e.g. 01/2022)"),
  description: z.string().min(1, "Description is required"),
});

export const awardsSchema = z.object({
  awards: z.array(awardItemSchema).optional(),
});

export type AwardsFormValues = z.infer<typeof awardsSchema>;
