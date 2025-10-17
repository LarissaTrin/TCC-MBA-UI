import { CardProps } from "@mui/material";

export interface GenericCardProps extends CardProps {
  title: string;
  value: string | number;
  description?: string;
  color?: string;
}