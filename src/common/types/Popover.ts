import { ReactElement, MouseEvent, PropsWithChildren } from "react";

/**
 * Props for the GenericPopover component.
 */
export interface GenericPopoverProps extends PropsWithChildren {
  /**
   * Optional ID for the popover, used for accessibility (`aria-labelledby`).
   */
  id?: string;

  /**
   * The trigger element that opens the popover when clicked.
   * Must be a React element that can accept an `onClick` prop (e.g., Button, IconButton, div).
   * The original `onClick` of this element will be preserved and called before opening the popover.
   */
  reactOpenPopover: ReactElement<{
    onClick?: (event: MouseEvent<HTMLElement>) => void;
  }>;
}
