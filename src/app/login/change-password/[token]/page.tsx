"use client";

import { Box, Typography, Stack } from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { resetPassword } from "@/common/services/authService";
import { GenericButton, GenericPanel, GenericTextField } from "@/components";

const changePasswordSchema = z
  .object({
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export default function ChangePasswordPage() {
  const router = useRouter();
  const params = useParams();
  
  const token = Array.isArray(params.token) ? params.token[0] : params.token;

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ChangePasswordFormData>({ resolver: zodResolver(changePasswordSchema) });

  const onSubmit: SubmitHandler<ChangePasswordFormData> = async (data) => {
    if (!token) {
      alert("Token de redefinição inválido ou não encontrado.");
      return;
    }
    await resetPassword(token, data.password);
    alert("Senha alterada com sucesso!");
    router.push("/login");
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" p={2}>
      <GenericPanel sx={{ width: 380, p: 4 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
            Crie uma Nova Senha
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <GenericTextField
              name="password"
              control={control}
              label="Nova Senha"
              type="password"
              autoFocus
            />
            <GenericTextField
              name="confirmPassword"
              control={control}
              label="Confirme a Nova Senha"
              type="password"
            />
            <GenericButton
              type="submit"
              label={isSubmitting ? "Salvando..." : "Salvar Nova Senha"}
              disabled={isSubmitting}
            />
          </Stack>
        </Box>
      </GenericPanel>
    </Box>
  );
}