"use client";

import { useState } from "react";
import { Box, Typography, Stack, Link, Alert } from "@mui/material";
import { signIn } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, LoginFormData } from "@/common/schemas/authSchema";
import { GeneralSize } from "@/common/enum";
import { GenericButton, GenericPanel, GenericTextField } from "@/components";
import { useLoading } from "@/common/context/LoadingContext";
import { useNavigation } from "@/common/hooks";
import { useTranslation } from "@/common/provider";

export default function LoginCardFullScreen() {
  const { t } = useTranslation();
  const { withLoading } = useLoading();
  const { navigate } = useNavigation();
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setError(null);

    const result = await withLoading(() =>
      signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: "/home",
      }),
    );

    if (result?.error) {
      setError(t("auth.login.invalidCredentials"));
      return;
    }

    navigate("/home");
  };

  const handleForgot = () => navigate("/login/forgot-password");
  const handleRegister = () => navigate("/login/register");

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" p={2}>
      <GenericPanel sx={{ width: 360, p: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
            {t("auth.login.title")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("auth.login.subtitle")}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: "100%" }}>
          <Stack spacing={2}>
            <GenericTextField
              name="email"
              control={control}
              label={t("auth.login.email")}
              type="email"
              autoFocus
              size={GeneralSize.Small}
            />

            <GenericTextField
              name="password"
              control={control}
              label={t("auth.login.password")}
              type="password"
              size={GeneralSize.Small}
            />

            <Box display="flex" justifyContent="flex-end" alignItems="center">
              <Link component="button" type="button" variant="body2" onClick={handleForgot}>
                {t("auth.login.forgotPassword")}
              </Link>
            </Box>

            <GenericButton
              type="submit"
              label={isSubmitting ? t("auth.login.submitting") : t("auth.login.submit")}
              disabled={isSubmitting}
            />

            <Box textAlign="center" mt={2} pt={2} borderTop={1} borderColor="grey.200">
              <Typography variant="body2" display="inline" color="text.secondary">
                {t("auth.login.noAccount")}{" "}
              </Typography>
              <Link
                component="button"
                variant="body2"
                type="button"
                onClick={handleRegister}
                sx={{ verticalAlign: "baseline" }}
              >
                {t("auth.login.signUp")}
              </Link>
            </Box>
          </Stack>
        </Box>
      </GenericPanel>
    </Box>
  );
}
