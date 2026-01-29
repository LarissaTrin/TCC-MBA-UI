import { DrawerProps } from "@mui/material";

/**
 * Props for the GenericDrawer component.
 */
export interface GenericDrawerProps extends DrawerProps {
  /**
   * Controls if the Drawer is visible or not.
   */
  open: boolean;

  /**
   * The edge of the screen from which the Drawer should appear.
   * - left
   * - top
   * - right
   * - bottom
   * @default 'left'
   */
  anchor?: "left" | "top" | "right" | "bottom";

  /**
   * The operating mode of the Drawer.
   * - permanent
   * - persistent
   * - temporary
   * @default 'temporary'
   */
  variant?: "permanent" | "persistent" | "temporary";

  disableIcon?: boolean;
  headerTitle?: React.ReactNode | string;

  /**
   * Callback function triggered when the Drawer requests to be closed
   * (e.g., by clicking the backdrop or pressing the Esc key).
   */
  onClose?: () => void;
}
