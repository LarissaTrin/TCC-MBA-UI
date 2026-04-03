import { GenericListProps } from "@/common/model";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React from "react";
import { GenericIcon, GenericLoading } from "./";

export function GenericList({ items, loading, collapsed }: GenericListProps) {
  return (
    <List>
      {loading && (
        <ListItem>
          <GenericLoading />
        </ListItem>
      )}

      {items?.map((item, index) => (
        <React.Fragment key={index}>
          {item.dividerAbove && <Divider component="li" />}

          <ListItem disablePadding>
            <ListItemButton
              style={{ alignContent: "center" }}
              component={item.href ? "a" : "button"}
              href={item.href}
              onClick={item.onClick}
            >
              {item.icon && (
                <ListItemIcon
                  style={collapsed ? { justifyContent: "center" } : {}}
                >
                  <GenericIcon icon={item.icon} />
                </ListItemIcon>
              )}
              {!collapsed && <ListItemText primary={item.label} />}
            </ListItemButton>
          </ListItem>

          {item.dividerBelow && <Divider component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
}
