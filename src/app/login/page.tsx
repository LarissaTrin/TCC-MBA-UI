"use client";

import { useState } from "react";
import { Box, Typography, Stack, Link, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, LoginFormData } from "@/common/schemas/authSchema";
import { GeneralSize } from "@/common/enum";
import { GenericButton, GenericPanel, GenericTextField } from "@/components";

export default function LoginCardFullScreen() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setError(null);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl: "/home",
    });

    if (result?.error) {
      setError("Email ou senha inválidos.");
      return;
    }

    router.push("/home");
  };

  const handleForgot = () => {
    router.push("/login/forgot-password");
  };

  const handleRegister = () => router.push("/login/register");

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={2}
    >
      <GenericPanel sx={{ width: 360, p: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Typography
            variant="h5"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            Login
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to your account
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: "100%" }}
        >
          <Stack spacing={2}>
            <GenericTextField
              name="email"
              control={control}
              label="Email Address"
              type="email"
              autoFocus
              size={GeneralSize.Small}
            />

            <GenericTextField
              name="password"
              control={control}
              label="Password"
              type="password"
              size={GeneralSize.Small}
            />

            <Box display="flex" justifyContent="flex-end" alignItems="center">
              <Link component="button" variant="body2" onClick={handleForgot}>
                Forgot password?
              </Link>
            </Box>

            <GenericButton
              type="submit"
              label={isSubmitting ? "Signing..." : "Sign In"}
              disabled={isSubmitting}
            />

            <Box
              textAlign="center"
              mt={2}
              pt={2}
              borderTop={1}
              borderColor="grey.200"
            >
              <Typography
                variant="body2"
                display="inline"
                color="text.secondary"
              >
                Don&apos;t have an account?{" "}
              </Typography>
              <Link
                component="button"
                variant="body2"
                onClick={handleRegister}
                sx={{ verticalAlign: "baseline" }}
              >
                Sign up
              </Link>
            </Box>
          </Stack>
        </Box>
      </GenericPanel>
    </Box>
  );
}
