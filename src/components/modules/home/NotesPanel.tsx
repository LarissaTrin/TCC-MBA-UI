"use client";

import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

import { ButtonVariant, GeneralSize } from "@/common/enum";
import { getNotes, saveNotes } from "@/common/services";
import { GenericButton, GenericPanel, GenericTextField } from "@/components";
import { useTranslation } from "@/common/provider";

export function NotesPanel() {
  const { t } = useTranslation();
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
        <Typography variant="h6">{t("home.notes.title")}</Typography>
        <GenericButton
          label={isSaving ? t("home.notes.saving") : t("common.save")}
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
        slotProps={{ htmlInput: { 'aria-label': t('home.notes.title') } }}
      />
    </GenericPanel>
  );
}
