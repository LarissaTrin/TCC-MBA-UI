"use client";

import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { GenericCard } from "@/components/widgets";
import { GenericCardProps } from "@/common/model";
import { BurndownResponse, ProjectStatsResponse } from "@/common/model/dashboard";
import { dashboardService } from "@/common/services/dashboardService";
import {
  buildBurndownChart,
  buildByListChart,
  buildByPriorityChart,
  buildByTagChart,
} from "@/common/utils/dashboardUtils";
import { useTranslation } from "@/common/provider";
import { useLoading } from "@/common/context/LoadingContext";
import { Skeleton } from "@mui/material";

import dynamic from "next/dynamic";
import { DashboardFilters } from "./DashboardFilters";
import { useDashboardFilters } from "./useDashboardFilters";

const DynamicGenericChart = dynamic(
  () => import("@/components/widgets/Chart").then((mod) => mod.GenericChart),
  { ssr: false },
);

interface DashboardContentProps {
  projectId: number;
}

export function DashboardContent({ projectId }: DashboardContentProps) {
  const { t } = useTranslation();
  const { withLoading } = useLoading();
  const [stats, setStats] = useState<ProjectStatsResponse | null>(null);
  const [burndown, setBurndown] = useState<BurndownResponse | null>(null);
  const [burndownLoading, setBurndownLoading] = useState(false);

  const { applied, draft, isFiltered, setDraftStart, setDraftEnd, onApply, onClear } =
    useDashboardFilters();

  useEffect(() => {
    withLoading(() => dashboardService.getProjectStats(projectId))
      .then(setStats)
      .catch(console.error);
  }, [projectId]);

  useEffect(() => {
    if (!applied.start || !applied.end) return;
    setBurndownLoading(true);
    dashboardService
      .getBurndown(projectId, applied.start, applied.end)
      .then(setBurndown)
      .catch(console.error)
      .finally(() => setBurndownLoading(false));
  }, [projectId, applied.start, applied.end]);

  if (!stats) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Grid container spacing={2}>
          {[0, 1, 2].map((i) => (
            <Grid size={{ xs: 12, md: 4 }} key={i}>
              <Skeleton variant="rounded" height={90} />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={2}>
          {[0, 1, 2].map((i) => (
            <Grid size={{ xs: 12, md: 4 }} key={i}>
              <Skeleton variant="rounded" height={90} />
            </Grid>
          ))}
        </Grid>
        <Skeleton variant="rounded" height={260} />
      </Box>
    );
  }

  const completed = stats.byList
    .filter((l) => l.isFinal)
    .reduce((sum, l) => sum + l.count, 0);
  const inProgress = stats.totalCards - completed;
  const completionRate =
    stats.totalCards > 0
      ? Math.round((completed / stats.totalCards) * 100)
      : 0;

  const kpis: GenericCardProps[] = [
    { title: t("dashboard.totalCards"), value: stats.totalCards, color: "primary" },
    { title: t("dashboard.inProgress"), value: inProgress, color: "warning.main" },
    { title: t("dashboard.completed"), value: completed, color: "success.main" },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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

      <Grid container spacing={2}>
        {kpis.map((kpi) => (
          <Grid size={{ xs: 12, md: 4 }} key={kpi.title}>
            <GenericCard title={kpi.title} value={kpi.value} color={kpi.color} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <GenericCard
            title={t("dashboard.completionRate")}
            value={`${completionRate}%`}
            description={t("dashboard.completedOf")
              .replace("{completed}", String(completed))
              .replace("{total}", String(stats.totalCards))}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <GenericCard
            title={t("dashboard.avgLeadTime")}
            value={stats.leadTimeDays !== null ? `${stats.leadTimeDays} days` : "—"}
            description={
              stats.leadTimeDays !== null
                ? t("dashboard.creationToCompletion")
                : t("dashboard.noCompletedCards")
            }
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <GenericCard
            title={t("dashboard.avgCycleTime")}
            value={stats.cycleTimeDays !== null ? `${stats.cycleTimeDays} days` : "—"}
            description={
              stats.cycleTimeDays !== null
                ? t("dashboard.startToCompletion")
                : t("dashboard.insufficientHistory")
            }
          />
        </Grid>
      </Grid>

      <Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {t("dashboard.burndownChart")}
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
            {t("dashboard.loadingBurndown")}
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
            {t("dashboard.noCardsInPeriod")}
          </Typography>
        )}
      </Box>

      {stats.byList.length > 0 && (
        <DynamicGenericChart
          title={t("dashboard.cardsByColumn")}
          options={buildByListChart(stats)}
        />
      )}

      {stats.byPriority.length > 0 && (
        <DynamicGenericChart
          title={t("dashboard.cardsByPriority")}
          options={buildByPriorityChart(stats)}
        />
      )}

      {stats.byTag.length > 0 && (
        <DynamicGenericChart
          title={t("dashboard.cardsByTag")}
          options={buildByTagChart(stats)}
        />
      )}
    </Box>
  );
}
