"use client";

import { Box } from "@mui/material";
import { useState } from "react";

import { GenericAccordion } from "@/components";

export default function Home() {
  const [open, setOpen] = useState(false);
  return (
    <Box id="test" sx={{ flexGrow: 1 }}>
      <p>testeeeeeeeeeeeeeeeeeeee</p>
      <p>testeeeeeeeeeeeeeeeeeeee</p>
      <p>testeeeeeeeeeeeeeeeeeeee</p>
      <p>testeeeeeeeeeeeeeeeeeeee</p>
      <GenericAccordion
        orientation="horizontal"
        header="Horizontal Accordion"
        height={"500px"}
      >
        <Box width={200}>Esse é o conteúdo lateral (horizontal)</Box>
      </GenericAccordion>
      <GenericAccordion
        orientation="vertical"
        header="Vertical Accordion"
        defaultExpanded
        disableCollapse
      >
        <Box width={200}>Esse é o conteúdo lateral (vertical)</Box>
      </GenericAccordion>
    </Box>
  );
}
