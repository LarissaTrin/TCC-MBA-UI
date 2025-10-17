import { Card, CardContent, Typography } from "@mui/material";
import { GenericCardProps } from "@/common/model";

/**
 * Generic reusable card component for displaying KPI data.
 *
 * This component accepts all props from Material UI's CardProps.
 *
 * Props:
 * @param title - The title text shown in the card.
 * @param value - The main value to be displayed prominently.
 * @param description - Optional. Additional text shown below the value.
 * @param color - Optional. Color for the value text (e.g., "primary", "success.main").
 * @param ...props - All other native Material UI Card props.
 *
 * Example usage:
 * ```tsx
 * <GenericCard
 * title="Tasks Completed"
 * value={42}
 * color="success.main"
 * description="In the last 7 days"
 * />
 * ```
 */
export function GenericCard({
  title,
  value,
  description,
  color = "text.primary",
  ...props
}: GenericCardProps) {
  return (
    <Card {...props}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4" color={color}>
          {value}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}