"use client";

import { Box, CssBaseline } from "@mui/material";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import { GenericHeader, GenericSidebar } from "@/components";

interface BaseLayoutProps {
  children: ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname.startsWith("/login");

  if (isLoginPage) {
    return (
      <>
        <CssBaseline />
        {children}
      </>
    );
  }

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
