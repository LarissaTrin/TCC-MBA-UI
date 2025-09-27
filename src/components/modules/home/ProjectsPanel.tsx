import { Box, Typography } from "@mui/material";

import { Project } from "@/common/model";
import { DashboardPanel, GenericLoading } from "@/components";
interface ProjectsPanelProps {
  projects: Project[];
  isLoading: boolean;
}

export function ProjectsPanel({
  projects,
  isLoading,
}: ProjectsPanelProps) {
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
    <DashboardPanel title="My Projects">
      {isLoading ? (
        <GenericLoading />
      ) : (
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={1}>
          {projects.map((project) => renderProjectBox(project))}
        </Box>
      )}
    </DashboardPanel>
  );
}
