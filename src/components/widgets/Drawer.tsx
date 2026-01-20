import { Box, Drawer } from "@mui/material";

import { GenericDrawerProps } from "@/common/model";
import { GenericIcon } from "./Icon";

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
export function GenericDrawer({
  open,
  anchor = "left",
  variant = "temporary",
  disableIcon,
  children,
  onClose,
  ...props
}: GenericDrawerProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor={anchor}
      variant={variant}
      {...props}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {!disableIcon && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 1,
            }}
          >
            <GenericIcon
              icon="close"
              onClick={onClose}
              sx={{ cursor: "pointer" }}
            />
          </Box>
        )}
        {children}
      </Box>
    </Drawer>
  );
}
