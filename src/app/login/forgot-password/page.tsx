"use client";

import { useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { requestPasswordReset } from "@/common/services/passwordService";
import { GenericButton, GenericPanel, GenericTextField } from "@/components";

// Schema e Tipo
const forgotSchema = z.object({
  email: z.string().email("Por favor, insira um email válido."),
});
type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ForgotFormData>({ resolver: zodResolver(forgotSchema) });

  const onSubmit: SubmitHandler<ForgotFormData> = async (data) => {
    await requestPasswordReset(data.email);
    setSubmitted(true);
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={2}
    >
      <GenericPanel sx={{ width: 380, p: 4 }}>
        {submitted ? (
          <Box textAlign="center">
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Verifique seu Email
            </Typography>
            <Typography color="text.secondary">
              Se uma conta com este email existir, enviamos um link para você
              redefinir sua senha.
            </Typography>
            <GenericButton
              label="Voltar para o Login"
              onClick={() => router.push("/login")}
              sx={{ mt: 3 }}
            />
          </Box>
        ) : (
          <>
            <Box textAlign="center" mb={3}>
              <Typography
                variant="h5"
                component="h1"
                fontWeight="bold"
                gutterBottom
              >
                Redefinir Senha
              </Typography>
              <Typography color="text.secondary">
                Insira seu email e enviaremos um link para você voltar a acessar
                sua conta.
              </Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <GenericTextField
                  name="email"
                  control={control}
                  label="Email Address"
                  type="email"
                  autoFocus
                />
                <GenericButton
                  type="submit"
                  label={isSubmitting ? "Enviando..." : "Enviar Link"}
                  disabled={isSubmitting}
                />
              </Stack>
            </Box>
          </>
        )}
      </GenericPanel>
    </Box>
  );
}
