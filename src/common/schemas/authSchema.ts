import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Por favor, insira um email válido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ─── Register ────────────────────────────────────────────────────────────────

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "Primeiro nome é obrigatório."),
    lastName: z.string().min(1, "Sobrenome é obrigatório."),
    username: z.string().min(3, "O nome de usuário deve ter no mínimo 3 caracteres."),
    email: z.string().email("Por favor, insira um email válido."),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória."),
    terms: z.boolean().refine((val) => val === true, "Você deve aceitar os termos."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/** Payload sent to the API — UI-only fields omitted */
export type RegisterData = Omit<RegisterFormData, "confirmPassword" | "terms">;

// ─── Forgot password ─────────────────────────────────────────────────────────

export const forgotSchema = z.object({
  email: z.string().email("Por favor, insira um email válido."),
});

export type ForgotFormData = z.infer<typeof forgotSchema>;

// ─── Change password ─────────────────────────────────────────────────────────

export const changePasswordSchema = z
  .object({
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
