import { SxProps, Theme } from "@mui/system";
import { PropsWithChildren } from "react";

/**
 * Props for the GenericPanel component.
 */
export interface GenericPanelProps extends PropsWithChildren {
  /**
   * Optional ID to be applied to the panel container.
   */
  id?: string;
  sx?: SxProps<Theme>;
}
