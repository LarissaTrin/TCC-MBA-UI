import { ReactElement, MouseEvent } from "react";

/**
 * Props for the GenericMenu component.
 */
export interface GenericMenuProps {
  /**
   * Optional ID for the menu, used for accessibility (`aria-labelledby`).
   */
  id?: string;

  /**
   * The trigger element that opens the menu when clicked.
   * Must be a React element that can accept an `onClick` prop (e.g., Button, IconButton, div).
   * The original `onClick` of this element will be preserved and called before opening the menu.
   */
  children: ReactElement<{
    onClick?: (event: MouseEvent<HTMLElement>) => void;
  }>;

  /**
   * Array of menu items to be displayed in the dropdown.
   * Each item should have:
   * - `name`: The label of the menu item.
   * - `onClick`: Callback executed when the menu item is clicked.
   */
  items: GenericMenuItem[];
}

/**
 * Defines a single menu item for the GenericMenu.
 */
export interface GenericMenuItem {
  /**
   * The label displayed for the menu item.
   */
  name: string;

  /**
   * Callback function triggered when the menu item is clicked.
   * Receives the click event as parameter.
   */
  onClick: (event: MouseEvent<HTMLLIElement>) => void;
}
