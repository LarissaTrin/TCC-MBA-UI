"use client";

import { useEffect, useState } from "react";

import { useSearchParams, useRouter } from "next/navigation";
import { GenericTabs } from "@/components";
import { GenericPage } from "@/components/widgets/Page";
import { Box } from "@mui/material";
import { DashboardContent } from "@/components/modules/project/Dashboard";
import { BoardContent } from "@/components/modules/project/Board";
import { TimelineContent } from "@/components/modules/project/Timeline";
import { CardContent } from "@/components/modules/project/Card";
import { BoardFilters } from "@/components/modules/project/BoardFilters";
import { useBoardFilters } from "@/components/modules/project/useBoardFilters";
import { Section, Task } from "@/common/model";
import { cardService, sectionService } from "@/common/services";
import { mapCardsToTasks } from "@/common/utils/cardMapper";

export default function ProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectCardId, setSelectCardId] = useState<string | undefined>();
  const [sections, setSections] = useState<Section[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([sectionService.getSections(), cardService.getAll()]).then(
      ([sectionsApi, cards]) => {
        const orderedSections = [...sectionsApi].sort(
          (a, b) => a.order - b.order,
        );

        setSections(orderedSections);
        setTasks(mapCardsToTasks(cards));
        setLoading(false);
      },
    );
  }, []);

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
      content: <DashboardContent />,
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
    </GenericPage>
  );
}
