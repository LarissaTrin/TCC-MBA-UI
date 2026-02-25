"use client";

import {
  Box,
  CssBaseline,
  Theme,
  useMediaQuery,
} from "@mui/material";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { useSession } from "next-auth/react";

import { GenericHeader, GenericSidebar } from "@/components";

interface BaseLayoutProps {
  children: ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
  const pathname = usePathname();
  const {data} = useSession();
  const isLoginPage = pathname.startsWith("/login");

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  if (isLoginPage) {
    return (
      <>
        <CssBaseline />
        {children}
      </>
    );
  }

  return (
    <Box display="flex" height="100vh" width="100vw" overflow="hidden">
      <CssBaseline />
      <GenericHeader onMenuClick={handleSidebarToggle} fullName={data?.user.name} />

      <GenericSidebar
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? isSidebarOpen : true}
        onClose={() => setSidebarOpen(false)}
      />

      <Box display="flex" flex={1} marginTop="64px" overflow="hidden">
        <Box flex={1} overflow="auto">
          {children}
        </Box>
      </Box>
    </Box>
  );
}
