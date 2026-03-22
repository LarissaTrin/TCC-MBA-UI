"use client";

import { Box } from "@mui/material";
import { LanguagePicker, ThemePicker } from "@/components/widgets";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 8,
          right: 12,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          zIndex: 1500,
        }}
      >
        <LanguagePicker />
        <ThemePicker />
      </Box>
      {children}
    </>
  );
}
