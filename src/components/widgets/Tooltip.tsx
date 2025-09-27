import { Tooltip } from "@mui/material";
import { GenericTooltipProps } from "@/common/model";

/**
 * Generic and reusable tooltip component based on Material UI's Tooltip.
 *
 * This component wraps its children with a tooltip, allowing
 * configurable text and placement. It ensures consistent usage
 * of tooltips across the application.
 *
 * @param {ReactNode} children - The element that triggers the tooltip when hovered/focused.
 * @param {string} title - The text to display inside the tooltip.
 * @param {Placement} [placement="bottom"] - The placement of the tooltip.
 */
export function GenericTooltip({
  children,
  title,
  placement = "bottom",
}: GenericTooltipProps) {
  return (
    <Tooltip title={title} placement={placement}>
      {children}
    </Tooltip>
  );
}
