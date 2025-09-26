import GenericPanel from "@/components/Panel";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function HomePage() {
  return (
    <Box display="flex" flexDirection="column" gap={3} height="100%">
      <GenericPanel
        sx={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography>Data</Typography>
        <Typography>Welcome</Typography>
      </GenericPanel>
      <Box display="flex" flexDirection="row" gap={3} height="100%">
        <GenericPanel />
        <GenericPanel />
      </Box>
      <GenericPanel />
    </Box>
  );
}
