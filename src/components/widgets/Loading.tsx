import { Box, CircularProgress } from "@mui/material";

interface GenericLoadingProps {
  /** Centers the spinner to fill its parent container */
  fullPage?: boolean;
}

export function GenericLoading({ fullPage }: GenericLoadingProps) {
  if (fullPage) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
      >
        <CircularProgress />
      </Box>
    );
  }
  return <CircularProgress />;
}
