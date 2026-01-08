import { z } from "zod";
import { monthYearRegex } from "./regex";

export const certificationItemSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuingOrg: z.string().min(1, "Issuing organization is required"),
  issueDate: z
    .string()
    .min(1, "Issue date is required")
    .regex(monthYearRegex, "Use format MM/YYYY (e.g. 01/2022)"),
  expirationDate: z.string().optional(),
  credentialId: z.string().optional(),
});

export const certificationsSchema = z.object({
  certifications: z.array(certificationItemSchema),
});

export type CertificationsFormValues = z.infer<typeof certificationsSchema>;
