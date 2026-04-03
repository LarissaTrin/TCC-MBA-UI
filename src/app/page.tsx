"use client";

import { useState, useMemo } from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";

import { useHomePageData } from "@/common/hooks";
import { GenericPanel } from "@/components";
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
  const { t, locale } = useTranslation();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return t("home.greeting.morning");
    if (hour < 18) return t("home.greeting.afternoon");
    return t("home.greeting.evening");
  }, [t]);

  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat(locale === "pt-BR" ? "pt-BR" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());
  }, [locale]);

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

  return (
    <GenericPage
      sx={{
        height: { md: "100%" },
        overflowY: { xs: "auto", md: "hidden" },
        overflowX: "hidden",
        px: { xs: 1.5, sm: "2rem" },
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        gap={3}
        height={{ md: "100%" }}
        overflow={{ xs: "visible", md: "hidden" }}
      >
        <GenericPanel
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 100,
          }}
        >
          <Typography variant="h5" fontWeight={600}>{greeting}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textTransform: "capitalize" }}>{formattedDate}</Typography>
        </GenericPanel>

        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", md: "minmax(0, 1fr) minmax(0, 1fr)" }}
          gap={3}
          flex={{ md: 1 }}
          minHeight={{ md: 0 }}
          sx={{ width: "100%", minWidth: 0 }}
        >
          <GenericPanel sx={{ display: "flex", flexDirection: "column", minHeight: { xs: 400, md: 0 } }}>
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
                  onCardClick={(id, projectId) => {
                    setSelectCardId(id);
                    setSelectCardProjectId(projectId);
                  }}
                  embedded
                />
              )}
              {activeTab === 2 && (
                <PendingApprovalsPanel
                  pending={pendingApprovalCards}
                  isLoading={isLoading}
                  onCardClick={(id, projectId) => {
                    setSelectCardId(id);
                    setSelectCardProjectId(projectId);
                  }}
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
