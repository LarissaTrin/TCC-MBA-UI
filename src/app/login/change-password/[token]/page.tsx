"use client";

import { useMemo } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChangePasswordFormData } from "@/common/schemas/authSchema";

import { resetPassword } from "@/common/services/authService";
import { GenericButton, GenericPanel, GenericTextField } from "@/components";
import { useTranslation } from "@/common/provider";

export default function ChangePasswordPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const token = Array.isArray(params.token) ? params.token[0] : params.token;

  const changePasswordSchema = useMemo(
    () =>
      z
        .object({
          password: z.string().min(6, t("auth.changePassword.validation.passwordMin")),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t("auth.changePassword.validation.passwordsMismatch"),
          path: ["confirmPassword"],
        }),
    [t],
  );

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ChangePasswordFormData>({ resolver: zodResolver(changePasswordSchema) });

  const onSubmit: SubmitHandler<ChangePasswordFormData> = async (data) => {
    if (!token) {
      alert(t("auth.changePassword.invalidToken"));
      return;
    }
    await resetPassword(token, data.password);
    alert(t("auth.changePassword.success"));
    router.push("/login");
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" p={2}>
      <GenericPanel sx={{ width: 380, p: 4 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
            {t("auth.changePassword.title")}
          </Typography>
        </Box>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <GenericTextField
              name="password"
              control={control}
              label={t("auth.changePassword.newPassword")}
              type="password"
              autoFocus
            />
            <GenericTextField
              name="confirmPassword"
              control={control}
              label={t("auth.changePassword.confirmPassword")}
              type="password"
            />
            <GenericButton
              type="submit"
              label={isSubmitting ? t("auth.changePassword.submitting") : t("auth.changePassword.submit")}
              disabled={isSubmitting}
            />
          </Stack>
        </Box>
      </GenericPanel>
    </Box>
  );
}
