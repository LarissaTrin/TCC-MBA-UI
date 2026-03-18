"use client";

import { useMemo, useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { forgotPassword } from "@/common/services/authService";
import { GenericButton, GenericPanel, GenericTextField } from "@/components";
import { useLoading } from "@/common/context/LoadingContext";
import { useNavigation } from "@/common/hooks";
import { BackToLogin } from "@/components/modules/auth/BackToLogin";
import { useTranslation } from "@/common/provider";

type ForgotFormData = { email: string };

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const { withLoading } = useLoading();
  const { navigate } = useNavigation();
  const [submitted, setSubmitted] = useState(false);

  const forgotSchema = useMemo(
    () => z.object({ email: z.string().email(t("auth.forgotPassword.validation.emailInvalid")) }),
    [t],
  );

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ForgotFormData>({ resolver: zodResolver(forgotSchema) });

  const onSubmit: SubmitHandler<ForgotFormData> = async (data) => {
    await withLoading(() => forgotPassword(data.email));
    setSubmitted(true);
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" p={2}>
      <GenericPanel sx={{ width: 380, p: 4 }}>
        {submitted ? (
          <Box textAlign="center">
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {t("auth.forgotPassword.successTitle")}
            </Typography>
            <Typography color="text.secondary">
              {t("auth.forgotPassword.successDescription")}
            </Typography>
            <GenericButton
              label={t("auth.forgotPassword.returnButton")}
              onClick={() => navigate("/login")}
              sx={{ mt: 3 }}
            />
          </Box>
        ) : (
          <>
            <Box textAlign="center" mb={3}>
              <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
                {t("auth.forgotPassword.title")}
              </Typography>
              <Typography color="text.secondary">
                {t("auth.forgotPassword.description")}
              </Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <GenericTextField
                  name="email"
                  control={control}
                  label={t("auth.forgotPassword.emailLabel")}
                  type="email"
                  autoFocus
                />
                <GenericButton
                  type="submit"
                  label={isSubmitting ? t("auth.forgotPassword.submitting") : t("auth.forgotPassword.submit")}
                  disabled={isSubmitting}
                />
                <BackToLogin />
              </Stack>
            </Box>
          </>
        )}
      </GenericPanel>
    </Box>
  );
}
