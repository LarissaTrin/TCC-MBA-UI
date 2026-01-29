import { z } from "zod";

export const cardSchema = z
  .object({
    id: z.number().min(1, "ID é obrigatório"),
    name: z.string().min(1, "Nome não pode estar vazio"),
    description: z.string().optional(),
    user: z.string().optional(),
    status: z.string().optional(),
    date: z.string().optional(),
    priority: z.string().optional(),
    task: z.string().optional(),
    approver: z.string().optional(),
  })
  .transform((data) => ({
    ...data,
    id: Number(data.id),
  }));

export type CardFormData = z.infer<typeof cardSchema>;
