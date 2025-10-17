"use client";

import { useEffect, useMemo, useRef } from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import ApexCharts, { ApexOptions } from "apexcharts";
import { GenericCard, GenericChart } from "@/components/widgets";
import { GenericCardProps } from "@/common/model";

export function DashboardContent() {
  const chartRef = useRef<HTMLDivElement>(null);

  // Array de dados para os KPIs com a tipagem correta
  const kpiData: GenericCardProps[] = [
    { title: "Abertas", value: 14, color: "primary" },
    { title: "Em andamento", value: 8, color: "warning.main" },
    { title: "Finalizadas", value: 22, color: "success.main" },
  ];

  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        height: 300,
        toolbar: { show: false },
      },
      series: [
        { name: "Abertas", data: [10, 12, 7, 15, 9] },
        { name: "Finalizadas", data: [8, 11, 9, 10, 13] },
      ],
      xaxis: {
        categories: ["Jan", "Fev", "Mar", "Abr", "Mai"],
      },
      colors: ["#1976d2", "#2e7d32"],
      legend: { position: "top" },
      grid: {
        borderColor: "#f1f1f1",
      },
    }),
    []
  );

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
      <GenericChart title="Status por mês" options={chartOptions} />

      {/* KPI adicional */}
      <GenericCard
        title="Tempo médio de conclusão"
        value="3,8 dias"
        description="Média das últimas 30 ações finalizadas"
      />
    </Box>
  );
}
