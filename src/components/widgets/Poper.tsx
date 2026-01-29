"use client";

import { GenericPoperProps } from "@/common/model";
import {
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
} from "@mui/material";

export function GenericPoper({
  open,
  anchorRef,
  onClose,
  children,
}: GenericPoperProps) {
  return (
    <Popper
      sx={{ zIndex: 3000 }}
      open={open}
      anchorEl={anchorRef.current}
      role={undefined}
      transition
      disablePortal
      placement="bottom-end"
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin:
              placement === "bottom" ? "right top" : "right bottom",
          }}
        >
          <Paper elevation={8}>
            <ClickAwayListener onClickAway={onClose}>
              <MenuList id="split-button-menu" autoFocusItem>
                {children}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
}
