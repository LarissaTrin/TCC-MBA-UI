"use client";

import {
  Box,
  CssBaseline,
  Theme,
  useMediaQuery,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { useSession } from "next-auth/react";
import { setAuthToken } from "@/common/utils/tokenStore";

import { GenericHeader, GenericSidebar, GenericLoading } from "@/components";
import { LoadingProvider } from "@/common/context/LoadingContext";

interface BaseLayoutProps {
  children: ReactNode;
}

export function BaseLayout({ children }: BaseLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data, status } = useSession();
  const isLoginPage = pathname.startsWith("/login");

  // Set token synchronously during render — before any child useEffect runs.
  // This guarantees that when pages mount and make API calls, the token is ready.
  setAuthToken(data?.user?.accessToken);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md"),
  );

  if (isLoginPage) {
    return (
      <LoadingProvider>
        <CssBaseline />
        {children}
      </LoadingProvider>
    );
  }

  // Block children from rendering (and from firing their useEffects) until
  // NextAuth resolves the session. This prevents API calls without a token.
  if (status === "loading") {
    return (
      <LoadingProvider>
        <CssBaseline />
        <Box display="flex" alignItems="center" justifyContent="center" width="100vw" height="100vh">
          <GenericLoading />
        </Box>
      </LoadingProvider>
    );
  }

  // If unauthenticated on a protected route, redirect to login.
  // The middleware handles this server-side, but this covers the client-side edge case.
  if (status === "unauthenticated") {
    router.replace("/login");
    return null;
  }

  return (
    <LoadingProvider>
      <Box display="flex" height="100vh" width="100vw" overflow="hidden">
        <CssBaseline />
        <GenericHeader onMenuClick={() => setSidebarOpen((v) => !v)} fullName={data?.user.name} />

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
