"use client";

import { GeneralColor, GeneralSize } from "@/common/enum";
import { Card, Project } from "@/common/model";
import { cardService, projectService } from "@/common/services";
import GenericChip from "@/components/Chip";
import GenericList from "@/components/List";
import GenericLoading from "@/components/Loading";
import { GenericPage } from "@/components/Page";
import GenericPanel from "@/components/Panel";
import { Typography, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [cardsByUser, setCardsByUser] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingByCard, setLoadingByCard] = useState(true);

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

  function renderCardLabel(card: Card) {
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <Typography variant="body2" fontWeight="bold">
          {card.name}
        </Typography>
        <GenericChip
          label={card.status}
          size={GeneralSize.Small}
          color={
            card.status === "pending"
              ? GeneralColor.Warning
              : card.status === "in_progress"
              ? GeneralColor.Info
              : GeneralColor.Success
          }
        />
      </Box>
    );
  }

  function renderCardList(cards: Card[]) {
    const items = cards.map((card) => ({
      label: renderCardLabel(card),
      onClick: () => console.log("Card clicked:", card.id),
      secondary: card.status,
    }));

    return <GenericList items={items} loading={false} collapsed={false} />;
  }

  useEffect(() => {
    projectService
      .getAll()
      .then((data) => setProjects(data))
      .finally(() => setLoading(false));

    cardService
      .getAll()
      .then((data) => setCardsByUser(data))
      .finally(() => setLoadingByCard(false));
  }, []);

  return (
    <GenericPage sx={{ height: "100%" }}>
      <Box display="flex" flexDirection="column" gap={3} height="100%">
        <GenericPanel
          sx={{
            display: "flex",
            flexDirection: 'column',
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
          {/* Cards */}
          <GenericPanel
            sx={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Título fixo */}
            <Typography
              variant="h6"
              sx={{
                mb: 1,
                px: 1,
                py: 1,
                bgcolor: "background.paper",
                zIndex: 10,
              }}
            >
              Assigned to Me
            </Typography>

            {/* Box scrollável */}
            <Box sx={{ overflowY: "auto", flex: 1 }}>
              {loadingByCard ? <GenericLoading /> : renderCardList(cardsByUser)}
            </Box>
          </GenericPanel>

          {/* Projects */}
          <GenericPanel
            sx={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 1,
                px: 1,
                py: 1,
                bgcolor: "background.paper",
                zIndex: 10,
              }}
            >
              Projects to Me
            </Typography>

            <Box sx={{ overflowY: "auto", flex: 1 }}>
              {loading ? (
                <GenericLoading />
              ) : (
                <Box
                  display="grid"
                  gridTemplateColumns="repeat(3, 1fr)"
                  gap={1}
                >
                  {projects.map((project) => renderProjectBox(project))}
                </Box>
              )}
            </Box>
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
