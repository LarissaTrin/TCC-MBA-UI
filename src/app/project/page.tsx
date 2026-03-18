"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { GenericLoading, GenericButton } from "@/components";
import { GenericPage } from "@/components/widgets/Page";
import { projectService } from "@/common/services";
import { Project } from "@/common/model";
import { useNavigation } from "@/common/hooks";
import { NewProjectModal } from "@/components/modules/home/NewProjectModal";
import { ButtonVariant } from "@/common/enum";

export default function ProjectSelectionPage() {
  const { navigate } = useNavigation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function fetchProjects() {
    setIsLoading(true);
    projectService
      .getAll()
      .then(setProjects)
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  if (isLoading) return <GenericLoading fullPage />;

  return (
    <GenericPage>
      <GenericPage.Header>
        <GenericPage.Title>Selecionar Projeto</GenericPage.Title>
        <GenericButton
          label="New Project"
          startIcon="add"
          variant={ButtonVariant.Contained}
          onClick={() => setIsModalOpen(true)}
        />
      </GenericPage.Header>

      {projects.length === 0 ? (
        <Typography color="text.secondary">
          Nenhum projeto encontrado. Crie seu primeiro projeto.
        </Typography>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
          gap={2}
        >
          {projects.map((project) => (
            <Box
              key={project.id}
              onClick={() => navigate(`/project/${project.id}`)}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 3,
                cursor: "pointer",
                "&:hover": { bgcolor: "action.hover", borderColor: "primary.main" },
              }}
            >
              <Typography variant="h6">{project.projectName}</Typography>
            </Box>
          ))}
        </Box>
      )}

      <NewProjectModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </GenericPage>
  );
}
