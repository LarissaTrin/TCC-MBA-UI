"use client";

import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

import { ButtonVariant, GeneralSize } from "@/common/enum";
import { getNotes, saveNotes } from "@/common/services";
import { GenericButton, GenericPanel, GenericTextField } from "@/components";

export function NotesPanel() {
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getNotes().then((content) => setNotes(content)).catch(() => {});
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    await saveNotes(notes);
    setIsSaving(false);
  };

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
          label={isSaving ? "Salvando..." : "Save"}
          size={GeneralSize.Small}
          variant={ButtonVariant.Contained}
          onClick={handleSave}
          disabled={isSaving}
        />
      </Box>
      <GenericTextField
        name="notes"
        label=""
        rows={4}
        value={notes}
        onChange={(value) => setNotes(value)}
      />
    </GenericPanel>
  );
}
