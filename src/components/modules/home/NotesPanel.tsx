import { useState } from "react";
import { Box, Typography } from "@mui/material";

import { GeneralSize } from "@/common/enum";
import { GenericButton, GenericPanel, GenericTextField } from "@/components";

export function NotesPanel() {
  const [notes, setNotes] = useState("");
  const handleSave = () => console.log("Saving notes:", notes);

  return (
    <GenericPanel
      sx={{ minHeight: 150, p: 2, display: "flex", flexDirection: "column" }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="h6">Notes</Typography>
        <GenericButton
          label="Save"
          size={GeneralSize.Small}
          onClick={handleSave}
        />
      </Box>
      <GenericTextField
        name="notes"
        label=""
        rows={2}
        value={notes}
        onChange={(value) => setNotes(value)}
      />
    </GenericPanel>
  );
}
