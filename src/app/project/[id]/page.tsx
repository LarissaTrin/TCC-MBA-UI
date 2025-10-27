"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { GenericTabs } from "@/components";
import { GenericPage } from "@/components/widgets/Page";
import { Box, Typography } from "@mui/material";
import { DashboardContent } from "@/components/modules/project/Dashboard";
import { BoardContent } from "@/components/modules/project/Board";

// --- Crie componentes simples para o conteúdo de cada aba ---
const ListContent = () => <Typography>Conteúdo da Lista de Tarefas</Typography>;
const TimelineContent = () => <Typography>Conteúdo da Timeline</Typography>;

// 1. Defina a configuração das suas abas em um array
const tabsConfig = [
  { label: "Dashboard", value: "dashboard", content: <DashboardContent /> },
  { label: "Board", value: "board", content: <BoardContent /> },
  { label: "List", value: "list", content: <ListContent /> },
  { label: "Timeline", value: "timeline", content: <TimelineContent /> },
];

export default function ProjectPage() {
  // 2. Hooks do Next.js para gerenciar a rota e os parâmetros
  const router = useRouter();
  const searchParams = useSearchParams();

  // 3. Lógica para determinar a aba ativa
  // Pega o valor de 'tab' da URL. Se não existir, usa o valor da primeira aba como padrão.
  const activeTabValue = searchParams.get("tab") || tabsConfig[0].value;

  // Encontra o índice da aba ativa para passar ao componente GenericTabs
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

      {/* 5. Renderiza o conteúdo da aba ativa */}
      <Box sx={{ p: 2, flexGrow: 1 }}>
        {tabsConfig[selectedTabIndex]?.content}
      </Box>
    </GenericPage>
  );
}
