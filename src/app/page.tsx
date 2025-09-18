"use client";

import { AlertPosition, GeneralSize } from "@/common/enum";
import { GenericIcon } from "@/components";
import GenericAlert from "@/components/Alert";
import GenericButton from "@/components/Button";
import GenericHeader from "@/components/HeaderNavbar";
import GenericMenu from "@/components/Menu";
import { SnackbarCloseReason } from "@mui/material";
import { SyntheticEvent, useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <GenericHeader />
      <GenericMenu
        items={[
          { name: "Profile", onClick: () => console.log("Profile clicked") },
          { name: "My account", onClick: () => console.log("Account clicked") },
          { name: "Logout", onClick: () => console.log("Logout clicked") },
        ]}
      >
        <button>⚙️ Abrir Menu</button>
      </GenericMenu>
    </>
  );
}
