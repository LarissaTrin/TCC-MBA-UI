"use client";

import { useState } from "react";

import { useSearchParams, useRouter } from "next/navigation";
import { GenericTabs } from "@/components";
import { GenericPage } from "@/components/widgets/Page";
import { Box } from "@mui/material";
import { DashboardContent } from "@/components/modules/project/Dashboard";
import { BoardContent } from "@/components/modules/project/Board";
import { TimelineContent } from "@/components/modules/project/Timeline";
import { CardContent } from "@/components/modules/project/Card";

export default function ProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectCardId, setSelectCardId] = useState<string | undefined>();

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
          setSelectCardId={(cardId: string) => setSelectCardId(cardId)}
        />
      ),
    },
    {
      label: "Timeline",
      value: "timeline",
      content: (
        <TimelineContent
          setSelectCardId={(cardId: string) => setSelectCardId(cardId)}
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
          onClose={() => setSelectCardId(undefined)}
        />
      )}
    </GenericPage>
  );
}
