"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { GenericTabs } from "@/components";
import { GenericPage } from "@/components/widgets/Page";
import { Box } from "@mui/material";
import { DashboardContent } from "@/components/modules/project/Dashboard";
import { BoardContent } from "@/components/modules/project/Board";
import { TimelineCalendar } from "@/components/ui/Timeline";

const tabsConfig = [
  { label: "Dashboard", value: "dashboard", content: <DashboardContent /> },
  { label: "Board", value: "board", content: <BoardContent /> },
  { label: "Timeline", value: "timeline", content: <TimelineCalendar /> },
];

export default function ProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTabValue = searchParams.get("tab") || tabsConfig[0].value;

  const selectedTabIndex = tabsConfig.findIndex(
    (tab) => tab.value === activeTabValue
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
    </GenericPage>
  );
}
