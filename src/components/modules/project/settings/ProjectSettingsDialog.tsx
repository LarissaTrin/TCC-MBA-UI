"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
} from "@mui/material";
import { GenericTabs, GenericIcon } from "@/components/widgets";
import { GeneralSize } from "@/common/enum";
import { Section } from "@/common/model";
import { ProjectSettingsUsers } from "./ProjectSettingsUsers";
import { ProjectSettingsLists } from "./ProjectSettingsLists";
import { ProjectSettingsDetails } from "./ProjectSettingsDetails";

interface ProjectSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  sections: Section[];
}

const SETTINGS_TABS = [
  { label: "Usuários", value: "users" },
  { label: "Listas", value: "lists" },
  { label: "Detalhes", value: "details" },
];

export function ProjectSettingsDialog({
  open,
  onClose,
  sections,
}: ProjectSettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<string>("users");

  const handleDeleteProject = () => {
    console.log("Project deleted");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Configurações do Projeto
        <IconButton onClick={onClose} aria-label="fechar">
          <GenericIcon icon="close" size={GeneralSize.Medium} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <GenericTabs
          selectedTab={activeTab}
          handleChange={(_, value) => setActiveTab(value as string)}
          tabsList={SETTINGS_TABS}
        />

        <Box sx={{ pt: 3 }}>
          {activeTab === "users" && <ProjectSettingsUsers />}
          {activeTab === "lists" && (
            <ProjectSettingsLists sections={sections} />
          )}
          {activeTab === "details" && (
            <ProjectSettingsDetails onDeleteProject={handleDeleteProject} />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
