"use client";

import { AlertPosition, GeneralSize } from "@/common/enum";
import { GenericIcon } from "@/components";
import GenericAlert from "@/components/Alert";
import GenericButton from "@/components/Button";
import GenericHeader from "@/components/HeaderNavbar";
import GenericMenu from "@/components/Menu";
import GenericModal from "@/components/Modal";
import { SnackbarCloseReason } from "@mui/material";
import { SyntheticEvent, useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <GenericHeader />
      <button onClick={() => setOpen(true)}>⚙️ Abrir Modal</button>

      <GenericModal open={open} handleClose={() => setOpen(false)} title="title">
        <p>testeeeeeeeeeeeeeeeeeeee</p>
        <GenericMenu
          items={[
            { name: "Profile", onClick: () => console.log("Profile clicked") },
            {
              name: "My account",
              onClick: () => console.log("Account clicked"),
            },
            { name: "Logout", onClick: () => console.log("Logout clicked") },
          ]}
        >
          <button>⚙️ Abrir Menu</button>
        </GenericMenu>
      </GenericModal>
    </>
  );
}
