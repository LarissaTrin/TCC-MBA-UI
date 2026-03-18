"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Typography, Stack, Divider } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { GenericButton, GenericLoading, GenericPanel, GenericTextField } from "@/components";
import { UserProfile } from "@/common/model";
import { getProfile, updatePassword } from "@/common/services/userService";
import { useLoading } from "@/common/context/LoadingContext";
import { useTranslation } from "@/common/provider";

type PasswordFormData = { password?: string; confirmPassword?: string };

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" py={1}>
    <Typography variant="body1" fontWeight="bold">{label}</Typography>
    <Typography variant="body1" color="text.secondary">{value}</Typography>
  </Box>
);

export default function ProfilePage() {
  const { t } = useTranslation();
  const { withLoading } = useLoading();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const passwordSchema = useMemo(
    () =>
      z
        .object({
          password: z.string().min(6, t("profile.validation.passwordMin")).optional().or(z.literal("")),
          confirmPassword: z.string().optional().or(z.literal("")),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t("profile.validation.passwordsMismatch"),
          path: ["confirmPassword"],
        }),
    [t],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const userData = await withLoading(() => getProfile());
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [withLoading]);

  const onSubmit: SubmitHandler<PasswordFormData> = async (data) => {
    if (!data.password) {
      alert(t("profile.validationRequired"));
      return;
    }
    await withLoading(() => updatePassword(data));
    alert(t("profile.successMessage"));
    reset();
  };

  if (isLoading || !user) {
    return <GenericLoading fullPage />;
  }

  return (
    <Box display="flex" justifyContent="center" p={4}>
      <GenericPanel sx={{ maxWidth: 600, width: "100%" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t("profile.title")}
        </Typography>

        <Stack spacing={1} my={2}>
          <InfoRow label={t("profile.username")} value={user.username} />
          <InfoRow label={t("profile.firstName")} value={user.firstName} />
          <InfoRow label={t("profile.lastName")} value={user.lastName} />
          <InfoRow label={t("profile.email")} value={user.email} />
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Typography variant="h6">{t("profile.changePassword")}</Typography>
            <GenericTextField
              name="password"
              control={control}
              label={t("profile.newPassword")}
              type="password"
            />
            <GenericTextField
              name="confirmPassword"
              control={control}
              label={t("profile.confirmPassword")}
              type="password"
            />

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <GenericButton
                type="submit"
                label={isSubmitting ? t("profile.saving") : t("profile.save")}
                disabled={isSubmitting}
              />
            </Box>
          </Stack>
        </Box>
      </GenericPanel>
    </Box>
  );
}
