"use client";

import { useState } from "react";
import { Box, Divider, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { GenericSidebarProps } from "@/common/model";
import { GenericDrawer, GenericIcon, GenericList } from "./";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/common/provider";

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
  const { t } = useTranslation();
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
              label: t("nav.home"),
              icon: "home",
              onClick: () => {
                router.push("/");
              },
            },
            {
              label: t("nav.dashboard"),
              icon: "bar_chart_4_bars",
              onClick: () => {
                router.push("/project");
              },
            },
          ]}
        />
      </Box>

      <Box>
        <Divider />
        <ListItemButton
          onClick={() => window.open("https://forms.gle/P1J7KYEwCzfTGCCN9", "_blank")}
          sx={{ px: 2, py: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <GenericIcon icon="rate_review" />
          </ListItemIcon>
          {expanded && <ListItemText primary={t("nav.feedback")} primaryTypographyProps={{ variant: "body2" }} />}
        </ListItemButton>
        <Box textAlign="end" p={1}>
          {variant === "permanent" && (
            <GenericIcon
              icon={expanded ? "chevron_left" : "chevron_right"}
              onClick={() => setExpanded(!expanded)}
            />
          )}
        </Box>
      </Box>
    </GenericDrawer>
  );
}
