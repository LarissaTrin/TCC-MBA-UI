import { useState } from "react";
import { Box } from "@mui/material";
import { GenericSidebarProps } from "@/common/model";
import { GenericDrawer, GenericIcon, GenericList } from "./";
import { useRouter } from "next/navigation";

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
export function GenericSidebar({
  open,
  variant,
  onClose,
}: GenericSidebarProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(true);
  const drawerWidth = expanded ? 240 : 80;

  return (
    <GenericDrawer
      open={open}
      variant={variant}
      onClose={onClose}
      disableIcon
      sx={{
        width: variant === "permanent" ? drawerWidth : "auto",
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width:
            variant === "permanent" ? drawerWidth : "-webkit-fill-available",
          paddingTop: "64px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}
    >
      <Box sx={{ height: "100%" }}>
        <GenericList
          collapsed={!expanded}
          items={[
            {
              label: "Home",
              icon: "home",
              onClick: () => {
                router.push("/home");
              },
            },
            {
              label: "Home2",
              icon: "home",
              onClick: () => {
                router.push("/");
              },
            },
            {
              label: "Dashboard",
              icon: "bar_chart_4_bars",
              dividerBelow: true,
              onClick: () => {
                router.push("/project/1");
              },
            },
            {
              label: "Login",
              icon: !expanded ? "account_box" : undefined,
              onClick: () => {
                router.push("/login");
              },
            },
            {
              label: "Profile",
              icon: !expanded ? "user_attributes" : undefined,
              onClick: () => {
                router.push("/profile");
              },
              href: "#simple-list",
            },
          ]}
        />
      </Box>

      <Box textAlign="end" p={1}>
        {variant === "permanent" && (
          <GenericIcon
            icon={expanded ? "chevron_left" : "chevron_right"}
            onClick={() => setExpanded(!expanded)}
          />
        )}
      </Box>
    </GenericDrawer>
  );
}
