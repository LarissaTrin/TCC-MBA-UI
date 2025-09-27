// components/DashboardPanel.tsx (ou onde preferir)
import { Box, Typography, SxProps, Theme } from "@mui/material";
import { GenericPanel } from "@/components";

interface DashboardPanelProps {
  title: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

export function DashboardPanel({ title, children, sx }: DashboardPanelProps) {
  return (
    <GenericPanel
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        ...sx,
      }}
    >
      <Typography
        variant="h6"
        sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider" }}
      >
        {title}
      </Typography>
      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>{children}</Box>
    </GenericPanel>
  );
}
