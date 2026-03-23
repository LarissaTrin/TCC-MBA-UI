"use client";

import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import { GenericHeaderProps } from "@/common/model";
import { GenericAvatar, GenericIcon, GenericMenu, LanguagePicker, ThemePicker } from "./";
import { useTranslation } from "@/common/provider";
import { useNavigation } from "@/common/hooks";
import { signOut } from "next-auth/react";

/**
 * Application top navigation bar.
 *
 * Renders the app logo, language picker, theme picker, and user avatar menu
 * with profile and logout actions.
 *
 * @param onMenuClick - Callback to open the side drawer on mobile.
 * @param fullName - The current user's full name, used by the avatar.
 */
export function GenericHeader({
  onMenuClick,
  fullName = "",
}: GenericHeaderProps) {
  const { navigate } = useNavigation();
  const { t } = useTranslation();

  const settings = [
    { name: t("nav.profile"), onClick: () => navigate("/profile") },
    { name: t("nav.logout"), onClick: () => signOut({ redirectTo: "/login" }) },
  ];

  return (
    <AppBar position="fixed" sx={{ zIndex: 1500 }}>
      <Toolbar
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <GenericIcon icon="menu" onClick={onMenuClick} />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="a"
          sx={{
            mr: 2,
            display: { xs: "none", md: "flex" },
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "primary.main",
            textDecoration: "none",
          }}
        >
          TRINDADE
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <LanguagePicker />
          <ThemePicker />
          <Tooltip title={t("nav.openSettings")}>
            <GenericMenu items={settings}>
              <IconButton sx={{ p: 0 }}>
                <GenericAvatar fullName={fullName} />
              </IconButton>
            </GenericMenu>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
