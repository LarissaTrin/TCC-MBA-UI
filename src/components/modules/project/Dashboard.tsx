"use client";

import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { GenericCard } from "@/components/widgets";
import { GenericCardProps } from "@/common/model";
import { GenericLoading } from "@/components";
import {
  BurndownResponse,
  dashboardService,
  ProjectStatsResponse,
} from "@/common/services/dashboardService";
import {
  buildBurndownChart,
  buildByListChart,
  buildByPriorityChart,
  buildByTagChart,
} from "@/common/utils/dashboardUtils";

import dynamic from "next/dynamic";
import { DashboardFilters } from "./DashboardFilters";
import { useDashboardFilters } from "./useDashboardFilters";

const DynamicGenericChart = dynamic(
  () => import("@/components/widgets/Chart").then((mod) => mod.GenericChart),
  {
    ssr: false,
    loading: () => <Typography>Carregando gráfico...</Typography>,
  },
);

interface DashboardContentProps {
  projectId: number;
}

export function DashboardContent({ projectId }: DashboardContentProps) {
  const [stats, setStats] = useState<ProjectStatsResponse | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [burndown, setBurndown] = useState<BurndownResponse | null>(null);
  const [burndownLoading, setBurndownLoading] = useState(false);

  const { applied, draft, isFiltered, setDraftStart, setDraftEnd, onApply, onClear } =
    useDashboardFilters();

  // Carrega stats gerais do projeto (sempre projeto inteiro)
  useEffect(() => {
    dashboardService
      .getProjectStats(projectId)
      .then(setStats)
      .catch(console.error)
      .finally(() => setStatsLoading(false));
  }, [projectId]);

  // Carrega burndown sempre que o período aplicado mudar
  useEffect(() => {
    if (!applied.start || !applied.end) return;
    setBurndownLoading(true);
    dashboardService
      .getBurndown(projectId, applied.start, applied.end)
      .then(setBurndown)
      .catch(console.error)
      .finally(() => setBurndownLoading(false));
  }, [projectId, applied.start, applied.end]);

  if (statsLoading) return <GenericLoading />;
  if (!stats) return null;

  const completed = stats.byList
    .filter((l) => l.isFinal)
    .reduce((sum, l) => sum + l.count, 0);
  const inProgress = stats.totalCards - completed;
  const completionRate =
    stats.totalCards > 0
      ? Math.round((completed / stats.totalCards) * 100)
      : 0;

  const kpis: GenericCardProps[] = [
    { title: "Total de cards", value: stats.totalCards, color: "primary" },
    { title: "Em andamento", value: inProgress, color: "warning.main" },
    { title: "Concluídos", value: completed, color: "success.main" },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Filtro de período — topo do dashboard */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <DashboardFilters
          draft={draft}
          isFiltered={isFiltered}
          onChangeStart={setDraftStart}
          onChangeEnd={setDraftEnd}
          onApply={onApply}
          onClear={onClear}
        />
      </Box>

      {/* KPIs */}
      <Grid container spacing={2}>
        {kpis.map((kpi) => (
          <Grid size={{ xs: 12, md: 4 }} key={kpi.title}>
            <GenericCard title={kpi.title} value={kpi.value} color={kpi.color} />
          </Grid>
        ))}
      </Grid>

      {/* Taxa de conclusão + Lead Time + Cycle Time */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <GenericCard
            title="Taxa de conclusão"
            value={`${completionRate}%`}
            description={`${completed} de ${stats.totalCards} cards finalizados`}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <GenericCard
            title="Lead Time médio"
            value={stats.leadTimeDays !== null ? `${stats.leadTimeDays} dias` : "—"}
            description={
              stats.leadTimeDays !== null
                ? "Criação → conclusão"
                : "Nenhum card concluído"
            }
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <GenericCard
            title="Cycle Time médio"
            value={stats.cycleTimeDays !== null ? `${stats.cycleTimeDays} dias` : "—"}
            description={
              stats.cycleTimeDays !== null
                ? "Início do trabalho → conclusão"
                : "Histórico insuficiente"
            }
          />
        </Grid>
      </Grid>

      {/* Burndown Chart */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Burndown Chart
          <Typography
            component="span"
            variant="caption"
            color="text.secondary"
            sx={{ ml: 1 }}
          >
            {applied.start} → {applied.end}
          </Typography>
        </Typography>
        {burndownLoading && (
          <Typography variant="body2" color="text.secondary">
            Carregando burndown...
          </Typography>
        )}
        {!burndownLoading && burndown && burndown.points.length > 0 && (
          <DynamicGenericChart
            title={`Total: ${burndown.total} story points`}
            options={buildBurndownChart(burndown)}
          />
        )}
        {!burndownLoading && burndown && burndown.points.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            Nenhum card encontrado no período selecionado.
          </Typography>
        )}
      </Box>

      {/* Cards por lista */}
      {stats.byList.length > 0 && (
        <DynamicGenericChart
          title="Cards por coluna"
          options={buildByListChart(stats)}
        />
      )}

      {/* Cards por prioridade */}
      {stats.byPriority.length > 0 && (
        <DynamicGenericChart
          title="Cards por prioridade"
          options={buildByPriorityChart(stats)}
        />
      )}

      {/* Cards por tag */}
      {stats.byTag.length > 0 && (
        <DynamicGenericChart
          title="Cards por tag"
          options={buildByTagChart(stats)}
        />
      )}
    </Box>
  );
}
