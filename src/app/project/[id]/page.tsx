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
          tasks={tasks}
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
          tasks={tasks}
          setTasks={setTasks}
          loading={loading}
        />
      ),
    },
  ];

  const activeTabValue = searchParams.get("tab") || tabsConfig[0].value;

  const selectedTabIndex = tabsConfig.findIndex(
    (tab) => tab.value === activeTabValue,
  );

  const handleTabChange = (newValue: string) => {
    router.push(`?tab=${newValue}`);
  };

  return (
    <GenericPage sx={{ display: "flex", flexDirection: "column" }}>
      <GenericTabs
        selectedTab={activeTabValue}
        handleChange={(_, value) => handleTabChange(value as string)}
        tabsList={tabsConfig}
      />

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
