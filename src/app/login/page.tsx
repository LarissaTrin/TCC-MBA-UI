"use client";

import { Box, Typography, Stack, Link } from "@mui/material";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { GeneralSize } from "@/common/enum";
import { GenericButton, GenericPanel, GenericTextField } from "@/components";

const loginSchema = z.object({
  email: z.string().email("Por favor, insira um email válido."),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginCardFullScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Login submit", data);
    // Ex: router.push("/dashboard");
  };

  const handleForgot = () => {
    const currentEmail = getValues("email");
    console.log("Forgot password clicked:", currentEmail);
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
                Don’t have an account?{" "}
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
