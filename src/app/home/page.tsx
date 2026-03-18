"use client";

import { useState } from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";

import { useHomePageData } from "@/common/hooks";
import { GenericLoading, GenericPanel } from "@/components";
import { GenericPage } from "@/components/widgets/Page";
import {
  AssignedCardsPanel,
  MyDayPanel,
  NotesPanel,
  PendingApprovalsPanel,
  ProjectsPanel,
} from "@/components/modules/home";
import { CardContent } from "@/components/modules/project/card/Card";
import { useTranslation } from "@/common/provider";

export default function HomePage() {
  const { t } = useTranslation();
  const {
    projects,
    assignedCards,
    dueTodayCards,
    overdueCards,
    pendingApprovalCards,
    sectionNameMap,
    isLoading,
    error,
  } = useHomePageData();

  const [selectCardId, setSelectCardId] = useState<string | undefined>();
  const [selectCardProjectId, setSelectCardProjectId] = useState<number | undefined>();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: t("home.tabs.assignedToMe"), value: 0 },
    { label: t("home.tabs.myDay"), value: 1 },
    { label: t("home.tabs.pendingApprovals"), value: 2 },
  ];

  if (isLoading) {
    return <GenericLoading fullPage />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <GenericPage sx={{ height: "100%" }}>
      <Box display="flex" flexDirection="column" gap={3} height="100%" overflow="hidden">
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
          gridTemplateColumns={{ xs: "1fr", md: "minmax(0, 1fr) minmax(0, 1fr)" }}
          gap={3}
          flex={1}
          minHeight={0}
        >
          <GenericPanel sx={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: "divider", px: 1 }}
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </Tabs>
            <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
              {activeTab === 0 && (
                <AssignedCardsPanel
                  cards={assignedCards}
                  isLoading={isLoading}
                  onCardClick={(id, projectId) => {
                    setSelectCardId(id);
                    setSelectCardProjectId(projectId);
                  }}
                  embedded
                />
              )}
              {activeTab === 1 && (
                <MyDayPanel
                  dueToday={dueTodayCards}
                  overdue={overdueCards}
                  isLoading={isLoading}
                  embedded
                />
              )}
              {activeTab === 2 && (
                <PendingApprovalsPanel
                  pending={pendingApprovalCards}
                  isLoading={isLoading}
                  embedded
                />
              )}
            </Box>
          </GenericPanel>

          <ProjectsPanel projects={projects} isLoading={isLoading} />
        </Box>

        <NotesPanel />
      </Box>

      {!!selectCardId && (
        <CardContent
          id={selectCardId}
          sections={[]}
          onClose={() => {
            setSelectCardId(undefined);
            setSelectCardProjectId(undefined);
          }}
          userRole="User"
          homeMode
          projectId={selectCardProjectId}
          sectionNameMap={sectionNameMap}
        />
      )}
    </GenericPage>
  );
}
