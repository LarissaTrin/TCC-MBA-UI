"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Stack, Divider, CircularProgress } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { GenericButton, GenericPanel, GenericTextField } from "@/components";
import { UserProfile } from "@/common/model";
import { getProfile } from "@/common/services/userService";

// 1. Schema agora é SÓ para a senha
const passwordSchema = z
  .object({
    password: z.string().min(6, "A nova senha deve ter no mínimo 6 caracteres.").optional().or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

// Componente auxiliar para exibir as informações
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
    <Typography variant="body1" fontWeight="bold">{label}</Typography>
    <Typography variant="body1" color="text.secondary">{value}</Typography>
  </Box>
);

export default function ProfilePage() {
  // 2. Estado separado para os dados do usuário (que não são do formulário)
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' }
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const userData = await getProfile();
        setUser(userData); // Armazena os dados do usuário para exibição
      } catch (error) {
        console.error("Erro ao buscar perfil", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const onSubmit: SubmitHandler<PasswordFormData> = async (data) => {
    if (!data.password) {
      alert("Por favor, preencha o campo de nova senha.");
      return;
    }
    await updatePassword(data);
    alert("Senha alterada com sucesso!");
    reset(); // Limpa os campos do formulário após o sucesso
  };
  
  if (isLoading || !user) {
    return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
  }

  return (
    <Box display="flex" justifyContent="center" p={4}>
      <GenericPanel sx={{ maxWidth: 600, width: "100%" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Meu Perfil
        </Typography>
        
        {/* 3. Seção de informações (apenas leitura) */}
        <Stack spacing={1} my={2}>
          <InfoRow label="Usuário:" value={user.username} />
          <InfoRow label="Nome:" value={user.firstName} />
          <InfoRow label="Sobrenome:" value={user.lastName} />
          <InfoRow label="Email:" value={user.email} />
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* 4. Formulário apenas para a senha */}
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Typography variant="h6">Trocar Senha</Typography>
            <GenericTextField
              name="password"
              control={control}
              label="Nova Senha"
              type="password"
            />
            <GenericTextField
              name="confirmPassword"
              control={control}
              label="Confirmar Nova Senha"
              type="password"
            />
            
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <GenericButton
                type="submit"
                label={isSubmitting ? "Salvando..." : "Salvar Nova Senha"}
                disabled={isSubmitting}
              />
            </Box>
          </Stack>
        </Box>
      </GenericPanel>
    </Box>
  );
}

function updatePassword(data: { password?: string | undefined; confirmPassword?: string | undefined; }) {
  throw new Error("Function not implemented.");
}
