import { CardProps } from "@mui/material";
import { ApexOptions } from "apexcharts";

export interface GenericChartProps extends CardProps {
  title: string;
  options: ApexOptions;
}