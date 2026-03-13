"use client";

import { useState } from "react";
import { Box, Typography } from "@mui/material";

import { useHomePageData } from "@/common/hooks";
import { GenericLoading, GenericPanel } from "@/components";
import { GenericPage } from "@/components/widgets/Page";
import {
  AssignedCardsPanel,
  NotesPanel,
  ProjectsPanel,
} from "@/components/modules/home";
import { CardContent } from "@/components/modules/project/Card";

export default function HomePage() {
  const { projects, cards, isLoading, error } = useHomePageData();
  const [selectCardId, setSelectCardId] = useState<string | undefined>();

  if (isLoading) {
    return <GenericLoading fullPage />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }
  return (
    <GenericPage sx={{ height: "100%" }}>
      <Box display="flex" flexDirection="column" gap={3} height="100%">
        <GenericPanel
          sx={{
            display: "flex",
            flexDirection: "column",
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
          <AssignedCardsPanel
            cards={cards}
            isLoading={isLoading}
            onCardClick={(id) => setSelectCardId(id)}
          />
          <ProjectsPanel projects={projects} isLoading={isLoading} />
        </Box>

        <NotesPanel />
      </Box>

      {!!selectCardId && (
        <CardContent
          id={selectCardId}
          sections={[]}
          onClose={() => setSelectCardId(undefined)}
          userRole="User"
        />
      )}
    </GenericPage>
  );
}
