"use client";

import { useEffect, useState } from "react";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { GenericTabs } from "@/components";
import { GenericPage } from "@/components/widgets/Page";
import { Box } from "@mui/material";
import { DashboardContent } from "@/components/modules/project/Dashboard";
import { BoardContent } from "@/components/modules/project/Board";
import { TimelineContent } from "@/components/modules/project/Timeline";
import { CardContent } from "@/components/modules/project/Card";
import { BoardFilters } from "@/components/modules/project/BoardFilters";
import { useBoardFilters } from "@/components/modules/project/useBoardFilters";
import { ProjectSettingsDialog } from "@/components/modules/project/settings/ProjectSettingsDialog";
import { GenericButton } from "@/components/widgets";
import { ButtonVariant, GeneralSize } from "@/common/enum";
import { Card, Section, Task } from "@/common/model";
import { sectionService } from "@/common/services";
import { mapCardsToTasks } from "@/common/utils/cardMapper";

export default function ProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const projectId = Number(params.id);

  const [selectCardId, setSelectCardId] = useState<string | undefined>();
  const [sections, setSections] = useState<Section[]>([]);
  const [rawCards, setRawCards] = useState<Card[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    sectionService.getListsWithCards(projectId).then(({ sections: secs, cards }) => {
      const orderedSections = [...secs].sort((a, b) => a.order - b.order);
      setSections(orderedSections);
      setRawCards(cards);
      setTasks(mapCardsToTasks(cards));
      setLoading(false);
    });
  }, [projectId]);

  const {
    form: filterForm,
    filteredTasks,
    isFiltered,
    resetFilters,
    handleApply,
    tagOptions,
    userOptions,
  } = useBoardFilters(tasks);

  const activeTabValue = searchParams.get("tab") || "dashboard";
  const showFilters = activeTabValue === "board" || activeTabValue === "timeline";

  const tabsConfig = [
    {
      label: "Dashboard",
      value: "dashboard",
      content: <DashboardContent cards={rawCards} />,
    },
    {
      label: "Board",
      value: "board",
      content: (
        <BoardContent
          sections={sections}
          setSelectCardId={(cardId: string) => setSelectCardId(cardId)}
          tasks={filteredTasks}
          loading={loading}
        />
      ),
    },
    {
      label: "Timeline",
      value: "timeline",
      content: (
        <TimelineContent
          setSelectCardId={(cardId: string) => setSelectCardId(cardId)}
          sections={sections}
          tasks={filteredTasks}
          setTasks={setTasks}
          loading={loading}
        />
      ),
    },
  ];

  const selectedTabIndex = tabsConfig.findIndex(
    (tab) => tab.value === activeTabValue,
  );

  const handleTabChange = (newValue: string) => {
    router.push(`?tab=${newValue}`);
  };

  return (
    <GenericPage sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <GenericTabs
          selectedTab={activeTabValue}
          handleChange={(_, value) => handleTabChange(value as string)}
          tabsList={tabsConfig}
        />
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {showFilters && (
            <BoardFilters
              form={filterForm}
              tagOptions={tagOptions}
              userOptions={userOptions}
              isFiltered={isFiltered}
              onApply={handleApply}
              onClear={resetFilters}
            />
          )}
          <GenericButton
            startIcon="settings"
            label="Configurações"
            variant={ButtonVariant.Outlined}
            size={GeneralSize.Small}
            onClick={() => setSettingsOpen(true)}
          />
        </Box>
      </Box>

      <Box sx={{ p: 2, flexGrow: 1 }}>
        {tabsConfig[selectedTabIndex]?.content}
      </Box>
      {!!selectCardId && (
        <CardContent
          id={selectCardId}
          sections={sections}
          onClose={() => setSelectCardId(undefined)}
        />
      )}
      <ProjectSettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        sections={sections}
      />
    </GenericPage>
  );
}
