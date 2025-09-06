"use client";

import { AlertPosition, GeneralSize } from "@/common/enum";
import { GenericIcon } from "@/components";
import GenericAlert from "@/components/Alert";
import GenericButton from "@/components/Button";
import { SnackbarCloseReason } from "@mui/material";
import { SyntheticEvent, useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <GenericButton label={"test"} onClick={()=>setOpen(true)} />
      <GenericAlert
        open={open}
        content={"testeeeeeeeeeeee"}
        // anchorOrigin={AlertPosition.TopLeft}
        handleClose={() => {
          setOpen((p) => !p);
        }}
      />
    </>
  );
}
