// components/DashboardPanel.tsx (ou onde preferir)
import { Box, Typography, SxProps, Theme } from "@mui/material";
import { GenericPanel } from "@/components";

interface DashboardPanelProps {
  title: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  headerAction?: React.ReactNode;
}

export function DashboardPanel({ title, children, sx, headerAction }: DashboardPanelProps) {
  return (
    <GenericPanel
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        ...sx,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h6">{title}</Typography>
        {headerAction}
      </Box>
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>{children}</Box>
    </GenericPanel>
  );
}
