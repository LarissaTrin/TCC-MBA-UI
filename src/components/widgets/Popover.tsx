import { cloneElement, ReactElement, useState, MouseEvent } from "react";
import { Popover } from "@mui/material";

import { GenericPopoverProps } from "@/common/model";

/**
 * GenericPopover - A reusable and flexible popover component built on top of Material UI's Popover.
 *
 * This component allows you to render a clickable trigger element (`reactOpenPopover`)
 * that opens a customizable popover. The content of the popover is provided via `children`,
 * making it fully reusable across the app.
 *
 * @param {ReactElement} reactOpenPopover
 *   The trigger element that opens the popover when clicked.
 *   Must be a valid React element that can accept an `onClick` prop (e.g., Button, IconButton, div).
 *
 * @param {React.ReactNode} children
 *   The content to be displayed inside the popover.
 *
 * @param {string} [id]
 *   Optional ID used for accessibility on the popover.
 *
 * @example
 * <GenericPopover
 *   reactOpenPopover={<button>ℹ️ Info</button>}
 * >
 *   <div style={{ padding: 16 }}>This is inside the popover</div>
 * </GenericPopover>
 *
 * @remarks
 * - The `reactOpenPopover` element's original `onClick` handler will be preserved and executed before opening the popover.
 * - The component automatically manages open/close state.
 */
export function GenericPopover({
  reactOpenPopover,
  children,
  ...props
}: GenericPopoverProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const child = reactOpenPopover as ReactElement<{
    onClick?: (e: MouseEvent<HTMLElement>) => void;
  }>;

  return (
    <div style={{ height: "100%" }}>
      {cloneElement(child, {
        onClick: (event: MouseEvent<HTMLElement>) => {
          if (child.props.onClick) {
            child.props.onClick(event);
          }
          handleClick(event);
        },
      })}
      <Popover
        id="generic-popover"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{ zIndex: 3000 }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        {...props}
      >
        {children}
      </Popover>
    </div>
  );
}
