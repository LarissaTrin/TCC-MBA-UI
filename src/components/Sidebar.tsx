import { useState } from "react";
import { IconButton, Box } from "@mui/material";
import { GenericSidebarProps } from "@/common/model";
import GenericDrawer from "./Drawer";
import GenericList from "./List";
import { GenericIcon } from "./Icon";

/**
 * Generic and reusable sidebar component based on Material UI's Drawer.
 *
 * This component renders a permanent sidebar with a list of items.
 * It supports icons, dividers, links, and click callbacks within the list.
 * The sidebar width can be toggled between expanded and collapsed states.
 *
 * @component
 * @example
 * return (
 *   <GenericSidebar id="main-sidebar" />
 * );
 *
 * @param {string} id - The unique identifier for the sidebar.
 */
function GenericSidebar({ id }: GenericSidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const drawerWidth = expanded ? 240 : 80;

  return (
    <GenericDrawer
      open
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          paddingTop: "64px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}
    >
      <Box>
        <GenericList
          collapsed={!expanded}
          items={[
            { label: "Inbox", icon: "box" },
            { label: "Drafts", icon: "troubleshoot", dividerBelow: true },
            {
              label: "Trash",
              icon: !expanded ? "box" : undefined,
              onClick: () => console.log("Trash clicked"),
            },
            {
              label: "Spam",
              icon: !expanded ? "box" : undefined,
              href: "#simple-list",
            },
          ]}
        />
      </Box>

      <Box textAlign="end" p={1}>
        <GenericIcon
          icon={expanded ? "chevron_left" : "chevron_right"}
          onClick={() => setExpanded(!expanded)}
        />
      </Box>
    </GenericDrawer>
  );
}

export default GenericSidebar;
