"use client";

import { Box } from "@mui/material";

import { Example } from "@/components/widgets/test/ex";

export default function Home() {
  return (
    <Box id="test" sx={{ flexGrow: 1 }}>
      <Example />
    </Box>
  );
}
