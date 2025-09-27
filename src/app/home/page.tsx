"use client";

import { Project } from "@/common/model";
import { projectService } from "@/common/services";
import GenericLoading from "@/components/Loading";
import { GenericPage } from "@/components/Page";
import GenericPanel from "@/components/Panel";
import { Typography, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    projectService
      .getAll()
      .then((data) => setProjects(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <GenericPage sx={{ height: "100%" }}>
      <Box
        display="flex"
        flexDirection="column"
        gap={3}
        height="100%"
      >
        <GenericPanel
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 100,
          }}
        >
          <Typography>Data</Typography>
          <Typography>Welcome</Typography>
        </GenericPanel>

        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
          gap={3}
          flex={1}
          minHeight={300}
        >
          <GenericPanel sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
            {loading ? (
              <GenericLoading />
            ) : (
              <Typography>{projects[0]?.projectName}</Typography>
            )}
          </GenericPanel>

          <GenericPanel sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
            {loading ? (
              <GenericLoading />
            ) : (
              <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={1}>
                {projects.map((project) => renderProjectBox(project))}
              </Box>
            )}
          </GenericPanel>
        </Box>

        <GenericPanel
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 100,
          }}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <Typography>Total de projetos: {projects.length}</Typography>
          )}
        </GenericPanel>
      </Box>
    </GenericPage>
  );
}
