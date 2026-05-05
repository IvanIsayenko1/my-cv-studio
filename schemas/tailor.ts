import { z } from "zod";

export const tailorSchema = z.object({
  offerDescription: z
    .string()
    .min(100, "The offer description should be at least 100 characters")
    .max(8000, "The offer description should be at most 8000 characters"),
});

export type TailorFormValues = z.infer<typeof tailorSchema>;
