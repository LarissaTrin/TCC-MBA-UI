import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import { GenericHeaderProps } from "@/common/model";
import { GenericAvatar, GenericIcon, GenericMenu, ThemePicker } from "./";
import { useRouter } from "next/navigation";

/**
 * A generic and reusable Drawer component, based on Material UI's Drawer.
 *
 * This component wraps the MUI Drawer to provide a standardized interface
 * for navigation panels or temporary content that slides in from the edge of the screen.
 *
 * @param {boolean} open - Controls whether the Drawer is visible or not.
 * @param {() => void} onClose - Callback function triggered when the Drawer requests to be closed (e.g., by clicking the backdrop).
 * @param {'left' | 'top' | 'right' | 'bottom'} [anchor='left'] - The edge of the screen from which the Drawer should appear.
 * @param {'permanent' | 'persistent' | 'temporary'} [variant='temporary'] - The operating mode of the Drawer.
 * @param {React.ReactNode} children - The content to be rendered inside the Drawer.
 * @param {object} props - Other valid props for the MUI Drawer component to be passed through.
 */
export function GenericHeader({
  onMenuClick,
  fullName = "",
  ...props
}: GenericHeaderProps) {
  const router = useRouter();

  const settings = [
    { name: "Profile", onClick: () => router.push("/profile") },
    { name: "Logout", onClick: () => router.push("/login") },
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
            color: "inherit",
            textDecoration: "none",
          }}
        >
          LOGO
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <ThemePicker />
          <Tooltip title="Open settings">
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
