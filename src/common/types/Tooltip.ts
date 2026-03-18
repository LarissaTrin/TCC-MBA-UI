import { ReactElement } from "react";
import { PopperProps } from "@mui/material";

/**
 * Props for the GenericTooltip component.
 */
export interface GenericTooltipProps {
  /**
   * The element that triggers the tooltip when hovered/focused.
   * Must be a valid React element (e.g., Button, IconButton, etc.).
   */
  children: ReactElement;

  /**
   * The text displayed inside the tooltip.
   */
  title: string;

  /**
   * The placement of the tooltip.
   * @default "bottom"
   */
  placement?: PopperProps["placement"];
}
