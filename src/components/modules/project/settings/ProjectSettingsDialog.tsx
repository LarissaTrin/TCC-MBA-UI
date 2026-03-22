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
import { useTranslation } from "@/common/provider";

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

const canManageUsers = (role: string) => ["SuperAdmin", "Admin"].includes(role);
const canManageLists = (role: string) => ["SuperAdmin", "Admin", "Leader"].includes(role);
const canDeleteLists = (role: string) => ["SuperAdmin", "Admin"].includes(role);
const canEditProject = (role: string) => ["SuperAdmin", "Admin"].includes(role);

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
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  const tabs = [];
  if (canManageUsers(userRole)) tabs.push({ label: t("settings.tabs.users"), value: "users" });
  if (canManageLists(userRole)) tabs.push({ label: t("settings.tabs.lists"), value: "lists" });
  tabs.push({ label: t("settings.tabs.details"), value: "details" });

  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.value ?? "details");

  const handleDeleteProject = () => {
    onClose();
    navigate("/");
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
        {t("settings.title")}
        <IconButton onClick={onClose} aria-label="close">
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
