"use client";

import { useMemo, useState } from "react";
import { Path, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { RegisterFormData } from "@/common/schemas/authSchema";
import {
  Box,
  Typography,
  Stack,
  Link,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import { GeneralSize } from "@/common/enum";
import { GenericButton, GenericPanel, GenericTextField } from "@/components";
import { register as registerUser } from "@/common/services/userService";
import { useLoading } from "@/common/context/LoadingContext";
import { useNavigation } from "@/common/hooks";
import { BackToLogin } from "@/components/modules/auth/BackToLogin";
import { PolicyModal } from "@/components/modules/auth/PolicyModal";
import { useTranslation } from "@/common/provider";

export default function RegisterPage() {
  const { t } = useTranslation();
  const { withLoading } = useLoading();
  const { navigate } = useNavigation();
  const [error, setError] = useState<string | null>(null);
  const [policyModal, setPolicyModal] = useState<"terms" | "privacy" | null>(null);

  const registerSchema = useMemo(
    () =>
      z
        .object({
          firstName: z.string().min(1, t("auth.register.validation.firstNameRequired")),
          lastName: z.string().min(1, t("auth.register.validation.lastNameRequired")),
          username: z.string().min(3, t("auth.register.validation.usernameMin")),
          email: z.string().email(t("auth.register.validation.emailInvalid")),
          password: z.string().min(6, t("auth.register.validation.passwordMin")),
          confirmPassword: z.string().min(1, t("auth.register.validation.confirmRequired")),
          terms: z.boolean().refine((val) => val === true, t("auth.register.validation.termsRequired")),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t("auth.register.validation.passwordsMismatch"),
          path: ["confirmPassword"],
        }),
    [t],
  );

  const formFields: { name: Path<RegisterFormData>; label: string; type?: React.HTMLInputTypeAttribute }[] = [
    { name: "firstName", label: t("auth.register.firstName") },
    { name: "lastName", label: t("auth.register.lastName") },
    { name: "username", label: t("auth.register.username") },
    { name: "email", label: t("auth.register.email"), type: "email" },
    { name: "password", label: t("auth.register.password"), type: "password" },
    { name: "confirmPassword", label: t("auth.register.confirmPassword"), type: "password" },
  ];

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    try {
      await withLoading(() =>
        registerUser({
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      );
      navigate("/login");
    } catch {
      setError(t("auth.register.error"));
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" p={2}>
      <GenericPanel sx={{ width: 400, p: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            {t("auth.register.title")}
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: "100%" }}>
          <Stack spacing={2}>
            {formFields.map((field) => (
              <GenericTextField
                key={field.name}
                name={field.name}
                control={control}
                label={field.label}
                type={field.type}
                size={GeneralSize.Small}
              />
            ))}

            <FormControlLabel
              control={<Checkbox {...register("terms")} />}
              label={
                <Typography variant="body2">
                  {t("auth.register.terms")}{" "}
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={() => setPolicyModal("terms")}
                  >
                    {t("auth.register.termsLink")}
                  </Link>{" "}
                  {t("auth.register.and")}{" "}
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={() => setPolicyModal("privacy")}
                  >
                    {t("auth.register.privacyLink")}
                  </Link>
                  .
                </Typography>
              }
            />
            {errors.terms && (
              <Typography variant="caption" color="error">
                {errors.terms.message}
              </Typography>
            )}

            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}

            <GenericButton
              type="submit"
              label={isSubmitting ? t("auth.register.submitting") : t("auth.register.submit")}
              disabled={isSubmitting}
            />

            <BackToLogin />
          </Stack>
        </Box>
      </GenericPanel>

      <PolicyModal
        type={policyModal ?? "terms"}
        open={policyModal !== null}
        onClose={() => setPolicyModal(null)}
      />
    </Box>
  );
}
