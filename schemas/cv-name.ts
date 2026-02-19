import z from "zod";

export const cvNameSchema = z.object({
  name: z.string().min(5, {
    message: "Name must be at least 5 characters long.",
  }),
});

export type CVNameFormValues = z.infer<typeof cvNameSchema>;
