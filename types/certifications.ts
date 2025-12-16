import { z } from "zod";

export const certificationItemSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuingOrg: z.string().min(1, "Issuing organization is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  expirationDate: z.string().optional(),
  credentialId: z.string().optional(),
});

export const certificationsSchema = z.object({
  certifications: z.array(certificationItemSchema),
});

export type CertificationsFormValues = z.infer<typeof certificationsSchema>;
