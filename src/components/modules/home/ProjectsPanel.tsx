import { Box, Typography } from "@mui/material";

import { Project } from "@/common/model";
import { DashboardPanel, GenericButton, GenericLoading } from "@/components";
import { useState } from "react";
import { NewProjectModal } from "./NewProjectModal";
import { ButtonVariant } from "@/common/enum";
interface ProjectsPanelProps {
  projects: Project[];
  isLoading: boolean;
}

export function ProjectsPanel({ projects, isLoading }: ProjectsPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function renderProjectBox(project: Project) {
    return (
      <Box
        key={project.id}
        onClick={() => console.log(project.id)}
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
      <DashboardPanel title="My Projects">
        {isLoading ? (
          <GenericLoading />
        ) : (
          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={1}>
            <Box
              onClick={() => setIsModalOpen(true)}
              sx={{
                p: 2,
                cursor: "pointer",
                border: "2px dashed",
                borderColor: "divider",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                minHeight: 80,
                "&:hover": {
                  bgcolor: "action.hover",
                  borderColor: "primary.main",
                },
              }}
            >
              <GenericButton
                label="New Project"
                variant={ButtonVariant.Text}
                startIcon="add"
              />
            </Box>
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
