"use client";

import {
  Box,
  CssBaseline,
  Theme,
  useMediaQuery,
} from "@mui/material";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { setAuthToken } from "@/common/utils/tokenStore";

import { GenericHeader, GenericSidebar } from "@/components";
import { LoadingProvider } from "@/common/context/LoadingContext";

interface BaseLayoutProps {
  children: ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
  const pathname = usePathname();
  const { data } = useSession();
  const isLoginPage = pathname.startsWith("/login");

  useEffect(() => {
    setAuthToken(data?.user?.accessToken);
  }, [data?.user?.accessToken]);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const handleSidebarToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  if (isLoginPage) {
    return (
      <LoadingProvider>
        <CssBaseline />
        {children}
      </LoadingProvider>
    );
  }

  return (
    <LoadingProvider>
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
    </LoadingProvider>
  );
}
