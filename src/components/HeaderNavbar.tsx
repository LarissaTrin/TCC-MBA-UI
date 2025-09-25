import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import { GenericHeaderProps } from "@/common/model";
import GenericAvatar from "./Avatar";
import GenericMenu from "./Menu";

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
function GenericHeader({ ...props }: GenericHeaderProps) {
  const settings = [
    { name: "Profile", onClick: () => console.log("Profile clicked") },
    { name: "Account", onClick: () => console.log("Account clicked") },
    { name: "Dashboard", onClick: () => console.log("Dashboard clicked") },
    { name: "Logout", onClick: () => console.log("Logout clicked") },
  ];

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
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

        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <GenericMenu items={settings}>
              <IconButton sx={{ p: 0 }}>
                <GenericAvatar fullName="Remy Sharp" />
              </IconButton>
            </GenericMenu>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default GenericHeader;
