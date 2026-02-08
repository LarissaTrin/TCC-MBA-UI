import { z } from "zod";

export const newCardSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export type NewCardFormData = z.infer<typeof newCardSchema>;
