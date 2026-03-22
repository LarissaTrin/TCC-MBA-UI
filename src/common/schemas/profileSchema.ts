import { z } from "zod";

export const passwordSchema = z
  .object({
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres.").optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type PasswordFormData = z.infer<typeof passwordSchema>;
