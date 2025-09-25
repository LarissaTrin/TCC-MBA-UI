"use client";

import { AlertPosition, GeneralSize } from "@/common/enum";
import { GenericIcon } from "@/components";
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
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <GenericHeader />
      <GenericSidebar />
      <Box id="test" sx={{ flexGrow: 1, p: 3, marginTop: "64px" }}>
        <p>testeeeeeeeeeeeeeeeeeeee</p>
        <p>testeeeeeeeeeeeeeeeeeeee</p>
        <p>testeeeeeeeeeeeeeeeeeeee</p>
        <p>testeeeeeeeeeeeeeeeeeeee</p>
        <GenericPanel>
          <button onClick={() => setOpen(true)}>⚙️ Abrir Modal</button>
        </GenericPanel>
        <GenericModal
          open={open}
          handleClose={() => setOpen(false)}
          title="title"
        >
          <p>testeeeeeeeeeeeeeeeeeeee</p>
          <GenericMenu
            items={[
              {
                name: "Profile",
                onClick: () => console.log("Profile clicked"),
              },
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
      </Box>
    </Box>
  );
}
