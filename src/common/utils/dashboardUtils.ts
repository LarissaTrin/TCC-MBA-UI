import { ApexOptions } from "apexcharts";
import {
  BurndownResponse,
  ProjectStatsResponse,
} from "@/common/services/dashboardService";

export const PRIORITY_LABEL: Record<number, string> = {
  1: "Muito baixa",
  2: "Baixa",
  3: "Média",
  4: "Alta",
  5: "Muito alta",
};

export function buildByListChart(stats: ProjectStatsResponse): ApexOptions {
  const labels = stats.byList.map((l) => l.listName);
  const data = stats.byList.map((l) => l.count);
  const colors = stats.byList.map((l) => (l.isFinal ? "#2e7d32" : "#1976d2"));

  return {
    chart: { type: "bar", height: 280, toolbar: { show: false } },
    series: [{ name: "Cards", data }],
    xaxis: { categories: labels },
    colors,
    plotOptions: { bar: { distributed: true } },
    legend: { show: false },
    grid: { borderColor: "#f1f1f1" },
  } as ApexOptions;
}

export function buildByPriorityChart(stats: ProjectStatsResponse): ApexOptions {
  const sorted = [...stats.byPriority].sort((a, b) => {
    if (a.priority === null) return 1;
    if (b.priority === null) return -1;
    return a.priority - b.priority;
  });

  const labels = sorted.map((p) =>
    p.priority !== null
      ? (PRIORITY_LABEL[p.priority] ?? `P${p.priority}`)
      : "Sem prioridade",
  );
  const data = sorted.map((p) => p.count);

  return {
    chart: { type: "bar", height: 250, toolbar: { show: false } },
    series: [{ name: "Cards", data }],
    xaxis: { categories: labels },
    colors: ["#ed6c02"],
    legend: { show: false },
    grid: { borderColor: "#f1f1f1" },
  } as ApexOptions;
}

export function buildByTagChart(stats: ProjectStatsResponse): ApexOptions {
  return {
    chart: { type: "donut", height: 250 },
    series: stats.byTag.map((t) => t.count),
    labels: stats.byTag.map((t) => t.tagName),
    legend: { position: "bottom" },
  } as ApexOptions;
}

export function buildBurndownChart(data: BurndownResponse): ApexOptions {
  const categories = data.points.map((p) => p.date);
  const remaining = data.points.map((p) => p.remaining);
  const ideal = data.points.map((p) => p.ideal);

  return {
    chart: { type: "line", height: 320, toolbar: { show: false } },
    series: [
      { name: "Real", data: remaining },
      { name: "Ideal", data: ideal },
    ],
    xaxis: {
      categories,
      labels: { rotate: -45, style: { fontSize: "11px" } },
    },
    yaxis: { title: { text: "Story Points em aberto" }, min: 0 },
    stroke: {
      curve: "smooth",
      width: [3, 2],
      dashArray: [0, 6],
    },
    colors: ["#1976d2", "#9e9e9e"],
    legend: { position: "top" },
    grid: { borderColor: "#f1f1f1" },
    tooltip: { x: { format: "dd/MM/yy" } },
  } as ApexOptions;
}
