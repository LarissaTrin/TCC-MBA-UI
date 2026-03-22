"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, Typography, useTheme } from "@mui/material";
import ApexCharts from "apexcharts";
import { GenericChartProps } from "@/common/model";

/**
 * Generic reusable chart component based on ApexCharts.
 *
 * This component renders a chart inside a Material UI Card. It is designed
 * to be flexible and can render any type of chart supported by ApexCharts
 * by passing the configuration object.
 *
 * Props:
 * @param title - The title to be displayed above the chart.
 * @param options - The ApexCharts options object for chart configuration.
 * @param ...props - All other native Material UI Card props.
 *
 * Example usage:
 * ```tsx
 * const chartOptions = { chart: { type: 'line' }, series: [...], xaxis: [...] };
 * <GenericChart title="Sales Over Time" options={chartOptions} />
 * ```
 */
export function GenericChart({ title, options, ...props }: GenericChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    if (!chartRef.current || !options) return;

    const themedOptions = {
      ...options,
      theme: { mode: isDark ? "dark" : "light", ...(options.theme ?? {}) },
      chart: {
        ...options.chart,
        background: "transparent",
        foreColor: theme.palette.text.secondary,
      },
      grid: {
        borderColor: theme.palette.divider,
        ...(options.grid ?? {}),
      },
      tooltip: {
        theme: isDark ? "dark" : "light",
        ...(options.tooltip ?? {}),
      },
      legend: {
        labels: { colors: theme.palette.text.primary },
        ...(options.legend ?? {}),
      },
      xaxis: {
        ...options.xaxis,
        labels: { style: { colors: theme.palette.text.secondary }, ...(options.xaxis?.labels ?? {}) },
        axisBorder: { color: theme.palette.divider, ...(options.xaxis?.axisBorder ?? {}) },
        axisTicks: { color: theme.palette.divider, ...(options.xaxis?.axisTicks ?? {}) },
      },
      yaxis: Array.isArray(options.yaxis)
        ? options.yaxis.map((ax) => ({
            ...ax,
            labels: { style: { colors: theme.palette.text.secondary }, ...(ax.labels ?? {}) },
          }))
        : {
            ...options.yaxis,
            labels: {
              style: { colors: theme.palette.text.secondary },
              ...((options.yaxis as ApexYAxis)?.labels ?? {}),
            },
          },
    };

    const chart = new ApexCharts(chartRef.current, themedOptions);
    chart.render();

    return () => chart.destroy();
  }, [options, isDark, theme]);

  return (
    <Card {...props}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <div ref={chartRef} />
      </CardContent>
    </Card>
  );
}
