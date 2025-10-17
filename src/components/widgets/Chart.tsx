"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent, Typography } from "@mui/material";
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

  useEffect(() => {
    if (!chartRef.current || !options) return;

    const chart = new ApexCharts(chartRef.current, options);
    chart.render();

    return () => chart.destroy();
  }, [options]); // Re-renders the chart if options change

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
