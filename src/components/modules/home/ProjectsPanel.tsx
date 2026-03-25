import { Box, IconButton, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";

import { Project } from "@/common/model";
import { DashboardPanel, GenericButton, GenericIcon, GenericLoading } from "@/components";
import { useState } from "react";
import { NewProjectModal } from "./NewProjectModal";
import { ButtonVariant } from "@/common/enum";
import { useNavigation } from "@/common/hooks";
import { useTranslation } from "@/common/provider";
interface ProjectsPanelProps {
  projects: Project[];
  isLoading: boolean;
}

export function ProjectsPanel({ projects, isLoading }: ProjectsPanelProps) {
  const { navigate } = useNavigation();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [isModalOpen, setIsModalOpen] = useState(false);

  function renderProjectBox(project: Project) {
    return (
      <Box
        key={project.id}
        onClick={() => navigate(`/project/${project.id}`)}
        sx={{
          border: "1px solid",
          borderRadius: 2,
          p: 2,
          cursor: "pointer",
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        <Typography variant="body1">{project.projectName}</Typography>
      </Box>
    );
  }

  return (
    <>
      <DashboardPanel
        title={t("home.myProjects")}
        sx={{ maxHeight: { xs: 420, md: "none" } }}
        headerAction={
          isMobile ? (
            <Tooltip title={t("home.newProject")}>
              <IconButton size="small" onClick={() => setIsModalOpen(true)}>
                <GenericIcon icon="add" />
              </IconButton>
            </Tooltip>
          ) : (
            <GenericButton
              label={t("home.newProject")}
              variant={ButtonVariant.Outlined}
              startIcon="add"
              onClick={() => setIsModalOpen(true)}
            />
          )
        }
      >
        {isLoading ? (
          <GenericLoading />
        ) : (
          <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={1}>
            {projects.map((project) => renderProjectBox(project))}
          </Box>
        )}
      </DashboardPanel>
      <NewProjectModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
