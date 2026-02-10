import { z } from "zod";

export const projectDetailsSchema = z.object({
  projectName: z
    .string()
    .min(3, "O nome do projeto deve ter no mínimo 3 caracteres."),
  description: z.string().optional(),
});

export type ProjectDetailsData = z.infer<typeof projectDetailsSchema>;

export const newListSchema = z.object({
  name: z.string().min(1, "O nome da lista é obrigatório."),
});

export type NewListData = z.infer<typeof newListSchema>;

export const addUserSchema = z.object({
  email: z.string().email("Insira um e-mail válido."),
});

export type AddUserData = z.infer<typeof addUserSchema>;
