"use client";

import { Box } from "@mui/material";
import { useState } from "react";

import { GenericAccordion } from "@/components";
import { Example } from "@/components/widgets/test/ex";

export default function Home() {
  const [open, setOpen] = useState(false);
  return (
    <Box id="test" sx={{ flexGrow: 1 }}>
      <Example />
    </Box>
  );
}
