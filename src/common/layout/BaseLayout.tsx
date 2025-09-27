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
    <Box display="flex" height="100vh">
      <CssBaseline />
      <GenericHeader />

      <Box display="flex" flex={1} marginTop="64px">
        <GenericSidebar />

        <Box flex={1} overflow="auto">
          {children}
        </Box>
      </Box>
    </Box>
  );
}
