"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
  const [loading, setLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    setLoading(true);
    console.log("Register data:", data);
    setTimeout(() => setLoading(false), 1000);
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
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Create Account
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: "100%" }}
        >
          <Stack spacing={2}>
            <GenericTextField
              name={"firstName"}
              control={control}
              label="First Name"
              size={GeneralSize.Small}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />

            <GenericTextField
              name="lastName"
              control={control}
              label="Last Name"
              size={GeneralSize.Small}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />

            <GenericTextField
              name="username"
              control={control}
              label="Username"
              size={GeneralSize.Small}
              error={!!errors.username}
              helperText={errors.username?.message}
            />

            <GenericTextField
              name="email"
              control={control}
              label="Email"
              type="email"
              size={GeneralSize.Small}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <GenericTextField
              name="password"
              control={control}
              label="Password"
              type="password"
              size={GeneralSize.Small}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <GenericTextField
              name="confirmPassword"
              control={control}
              label="Confirm Password"
              type="password"
              size={GeneralSize.Small}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />

            <FormControlLabel
              control={<Checkbox {...register("terms")} />}
              label={
                <Typography variant="body2">
                  I agree to the{" "}
                  <Link href="#" target="_blank">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" target="_blank">
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

            <GenericButton
              type="submit"
              label={loading ? "Registering..." : "Create Account"}
              disabled={loading}
            />
          </Stack>
        </Box>
      </GenericPanel>
    </Box>
  );
}
