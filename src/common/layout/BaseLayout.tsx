"use client";

import GenericHeader from "@/components/HeaderNavbar";
import GenericSidebar from "@/components/Sidebar";
import { Box, CssBaseline } from "@mui/material";
import { ReactNode } from "react";

interface BaseLayoutProps {
  children: ReactNode;
}

export default function BaseLayout({ children }: BaseLayoutProps) {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <GenericHeader />
      <GenericSidebar />
      <Box
        id="test"
        sx={{
          flexGrow: 1,
          pt: "88px",
          px: "24px",
          pb: "24px",
          height: "100vh",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
