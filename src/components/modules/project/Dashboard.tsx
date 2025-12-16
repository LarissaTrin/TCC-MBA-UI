"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { ApexOptions } from "apexcharts";
import { GenericCard } from "@/components/widgets";
import { Card, GenericCardProps } from "@/common/model";

import dynamic from "next/dynamic";
import { cardService } from "@/common/services";
import { Status } from "@/common/enum";
const DynamicGenericChart = dynamic(
  () =>
    import("@/components/widgets/Chart").then((mod) => mod.GenericChart),
  {
    ssr: false,
    loading: () => <Typography>Carregando gráfico...</Typography>,
  }
);

export function DashboardContent() {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    cardService.getAll().then(setCards);
  }, []);

  const kpiData: GenericCardProps[] = useMemo(() => {
    const abertas = cards.filter((c) => c.status === Status.Pending).length;
    const andamento = cards.filter(
      (c) => c.status === Status.InProgress
    ).length;
    const finalizadas = cards.filter(
      (c) => c.status === Status.Validation || c.status === Status.Done
    ).length;

    return [
      { title: "Abertas", value: abertas, color: "primary" },
      { title: "Em andamento", value: andamento, color: "warning.main" },
      { title: "Finalizadas", value: finalizadas, color: "success.main" },
    ];
  }, [cards]);

  const chartOptions: ApexOptions = useMemo(() => {
    const byMonth: Record<string, { abertas: number; finalizadas: number }> =
      {};
    cards.forEach((c) => {
      const date = new Date(c.dueDate);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!byMonth[key]) byMonth[key] = { abertas: 0, finalizadas: 0 };

      if (c.status === Status.Pending || c.status === Status.InProgress)
        byMonth[key].abertas++;
      else byMonth[key].finalizadas++;
    });

    const labels = Object.keys(byMonth).sort();
    const abertasSeries = labels.map((k) => byMonth[k].abertas);
    const finalizadasSeries = labels.map((k) => byMonth[k].finalizadas);

    return {
      chart: { type: "bar", height: 300, toolbar: { show: false } },
      series: [
        { name: "Abertas", data: abertasSeries },
        { name: "Finalizadas", data: finalizadasSeries },
      ],
      xaxis: {
        categories: labels.map((k) => {
          const [year, month] = k.split("-");
          return `${Number(month) + 1}/${year}`;
        }),
      },
      colors: ["#1976d2", "#2e7d32"],
      legend: { position: "top" },
      grid: { borderColor: "#f1f1f1" },
    } as ApexOptions;
  }, [cards]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* KPIs */}
      <Grid container spacing={2}>
        {kpiData.map((kpi) => (
          <Grid size={{ xs: 12, md: 4 }} key={kpi.title}>
            <GenericCard
              title={kpi.title}
              value={kpi.value}
              color={kpi.color}
            />
          </Grid>
        ))}
      </Grid>

      {/* Gráfico Status por mês */}
      <DynamicGenericChart title="Status por mês" options={chartOptions} />

      {/* KPI adicional */}
      <GenericCard
        title="Tempo médio de conclusão"
        value="3,8 dias"
        description="Média das últimas 30 ações finalizadas"
      />
    </Box>
  );
}
