"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Link,
} from "@mui/material";
import GenericButton from "@/components/Button";
import GenericTextField from "@/components/TextField";
import { GeneralSize } from "@/common/enum";
import GenericPanel from "@/components/Panel";

export default function LoginCardFullScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("Login submit", { email, password });
    setTimeout(() => setLoading(false), 700);
  };

  const handleForgot = () => console.log("Forgot password clicked:", email);
  const handleRegister = () => console.log("Register clicked");

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

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <Stack spacing={2}>
            <GenericTextField
              id="email"
              label="Email Address"
              type="email"
              required
              value={email}
              onChangeValue={(value) => setEmail(value)}
              autoFocus
              size={GeneralSize.Small}
            />

            <GenericTextField
              id="password"
              label="Password"
              type="password"
              required
              value={password}
              onChangeValue={(value) => setPassword(value)}
              size={GeneralSize.Small}
            />

            <Box display="flex" justifyContent="flex-end" alignItems="center">
              <Link component="button" variant="body2" onClick={handleForgot}>
                Forgot password?
              </Link>
            </Box>

            <GenericButton
              type="submit"
              label={loading ? "Signing..." : "Sign In"}
              disabled={loading}
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
