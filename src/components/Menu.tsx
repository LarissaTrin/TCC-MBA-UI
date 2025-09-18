import { cloneElement, ReactElement, useState, MouseEvent } from "react";
import { Menu, MenuItem } from "@mui/material";

import { GenericMenuProps } from "@/common/model";

/**
 * GenericMenu - A reusable and flexible menu component built on top of Material UI's Menu.
 *
 * This component allows you to render a clickable trigger element (children) that opens a dropdown menu.
 * The menu items are fully configurable via the `items` prop, making this component reusable in any part of your app.
 *
 * @param {ReactElement} children
 *   The trigger element that opens the menu when clicked.
 *   Must be a valid React element that can accept an `onClick` prop (e.g., Button, IconButton, div).
 *
 * @param {GenericMenuItem[]} items
 *   An array of menu items to be rendered.
 *   Each item should have:
 *     - `name`: string — the label displayed in the menu.
 *     - `onClick`: (event: MouseEvent<HTMLLIElement>) => void — callback when the menu item is clicked.
 *
 * @param {string} [id]
 *   Optional ID used for accessibility (`aria-labelledby`) on the menu.
 *
 * @example
 * <GenericMenu
 *   items={[
 *     { name: "Profile", onClick: () => console.log("Profile clicked") },
 *     { name: "My account", onClick: () => console.log("Account clicked") },
 *     { name: "Logout", onClick: () => console.log("Logout clicked") },
 *   ]}
 * >
 *   <button>⚙️ Open Menu</button>
 * </GenericMenu>
 *
 * @remarks
 * - The `children` element's original `onClick` handler will be preserved and executed before opening the menu.
 * - The component automatically handles opening/closing of the Material UI Menu.
 * - Each menu item's `onClick` will be called before closing the menu.
 */

function GenericMenu({ items, children, ...props }: GenericMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const child = children as ReactElement<{
    onClick?: (e: MouseEvent<HTMLElement>) => void;
  }>;

  return (
    <div>
      {cloneElement(child, {
        onClick: (event: MouseEvent<HTMLElement>) => {
          if (child.props.onClick) {
            child.props.onClick(event);
          }
          handleClick(event);
        },
      })}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
            onClick={(event) => {
              item.onClick(event);
              handleClose();
            }}
          >
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default GenericMenu;
