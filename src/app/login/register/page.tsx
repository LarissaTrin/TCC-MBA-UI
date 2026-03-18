"use client";

import { useState } from "react";
import { Path, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

// Schema Zod
const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z
      .boolean()
      .refine((val) => val === true, "You must accept the terms"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { withLoading } = useLoading();
  const { navigate } = useNavigation();
  const [error, setError] = useState<string | null>(null);
  const [policyModal, setPolicyModal] = useState<"terms" | "privacy" | null>(null);

  const formFields: {
    name: Path<RegisterFormData>;
    label: string;
    type?: React.HTMLInputTypeAttribute;
  }[] = [
    { name: "firstName", label: "First Name" },
    { name: "lastName", label: "Last Name" },
    { name: "username", label: "Username" },
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
    { name: "confirmPassword", label: "Confirm Password", type: "password" },
  ];

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

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
      setError("Erro ao criar conta. Verifique os dados e tente novamente.");
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={2}
    >
      <GenericPanel sx={{ width: 400, p: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Create Account
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: "100%" }}
        >
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
                  I agree to the{" "}
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={() => setPolicyModal("terms")}
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={() => setPolicyModal("privacy")}
                  >
                    Privacy Policy
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
              label={isSubmitting ? "Registering..." : "Create Account"}
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
