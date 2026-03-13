"use client";

import { useState } from "react";
import { useNavigation } from "@/common/hooks";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
} from "@mui/material";
import { GenericTabs, GenericIcon } from "@/components/widgets";
import { GeneralSize } from "@/common/enum";
import { ProjectMember, Section } from "@/common/model";
import { ProjectSettingsUsers } from "./ProjectSettingsUsers";
import { ProjectSettingsLists } from "./ProjectSettingsLists";
import { ProjectSettingsDetails } from "./ProjectSettingsDetails";

interface ProjectSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: number;
  projectTitle: string;
  projectDescription: string;
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;
  userRole: string;
  projectMembers: ProjectMember[];
  onMembersUpdate: (members: ProjectMember[]) => void;
}

// SuperAdmin e Admin podem gerenciar usuários
const canManageUsers = (role: string) => ["SuperAdmin", "Admin"].includes(role);
// SuperAdmin, Admin e Leader podem ver/gerenciar listas
const canManageLists = (role: string) => ["SuperAdmin", "Admin", "Leader"].includes(role);
// Apenas SuperAdmin e Admin podem deletar listas
const canDeleteLists = (role: string) => ["SuperAdmin", "Admin"].includes(role);
// Apenas SuperAdmin e Admin podem editar/excluir o projeto
const canEditProject = (role: string) => ["SuperAdmin", "Admin"].includes(role);

function buildTabs(role: string) {
  const tabs = [];
  if (canManageUsers(role)) tabs.push({ label: "Usuários", value: "users" });
  if (canManageLists(role)) tabs.push({ label: "Listas", value: "lists" });
  tabs.push({ label: "Detalhes", value: "details" });
  return tabs;
}

export function ProjectSettingsDialog({
  open,
  onClose,
  projectId,
  projectTitle,
  projectDescription,
  sections,
  onSectionsChange,
  userRole,
  projectMembers,
  onMembersUpdate,
}: ProjectSettingsDialogProps) {
  const { navigate } = useNavigation();
  const tabs = buildTabs(userRole);
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.value ?? "details");

  const handleDeleteProject = () => {
    onClose();
    navigate("/home");
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
          tabsList={tabs}
        />

        <Box sx={{ pt: 3 }}>
          {activeTab === "users" && canManageUsers(userRole) && (
            <ProjectSettingsUsers
              projectId={projectId}
              currentMembers={projectMembers}
              onMembersUpdate={onMembersUpdate}
            />
          )}
          {activeTab === "lists" && canManageLists(userRole) && (
            <ProjectSettingsLists
              projectId={projectId}
              sections={sections}
              onSectionsChange={onSectionsChange}
              canDelete={canDeleteLists(userRole)}
            />
          )}
          {activeTab === "details" && (
            <ProjectSettingsDetails
              projectId={projectId}
              projectTitle={projectTitle}
              projectDescription={projectDescription}
              onDeleteProject={handleDeleteProject}
              canEdit={canEditProject(userRole)}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
