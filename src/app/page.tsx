"use client";

import { AlertPosition, GeneralSize } from "@/common/enum";
import { GenericIcon } from "@/components";
import GenericAccordion from "@/components/Accordion";
import GenericAlert from "@/components/Alert";
import GenericButton from "@/components/Button";
import GenericHeader from "@/components/HeaderNavbar";
import GenericMenu from "@/components/Menu";
import GenericModal from "@/components/Modal";
import GenericPanel from "@/components/Panel";
import GenericSidebar from "@/components/Sidebar";
import { Box, CssBaseline, SnackbarCloseReason } from "@mui/material";
import { SyntheticEvent, useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);
  return (
      <Box id="test" sx={{ flexGrow: 1}}>
        <p>testeeeeeeeeeeeeeeeeeeee</p>
        <p>testeeeeeeeeeeeeeeeeeeee</p>
        <p>testeeeeeeeeeeeeeeeeeeee</p>
        <p>testeeeeeeeeeeeeeeeeeeee</p>
        <GenericAccordion
          orientation="horizontal"
          header="Horizontal Accordion"
          height={'500px'}
          
        >
          <Box width={200}>Esse é o conteúdo lateral (horizontal)</Box>
        </GenericAccordion>
        <GenericAccordion orientation="vertical" header="Vertical Accordion"defaultExpanded
          disableCollapse>
          <Box width={200}>Esse é o conteúdo lateral (vertical)</Box>
        </GenericAccordion>
      </Box>
  );
}
