import { Box } from "@mui/material";
import { GenericPanelProps } from "@/common/model";

/**
 * GenericPanel - A reusable container component with a rounded border.
 *
 * This component provides a standardized way to wrap content inside
 * a bordered and rounded panel, useful for grouping related information.
 *
 * @param {string} [id]
 *   Optional ID for the panel element.
 *
 * @param {React.ReactNode} children
 *   The content to be displayed inside the panel.
 *
 * @example
 * <GenericPanel>
 *   <p>This is inside a panel</p>
 * </GenericPanel>
 *
 * @remarks
 * - Uses Material UI's `Box` as the base element.
 * - Comes with a default border, rounded corners, and padding.
 * - Accepts all valid MUI `Box` props for further customization.
 */
function GenericPanel({ id, sx, children }: GenericPanelProps) {
  return (
    <Box
      sx={{
        border: "1px solid",
        borderRadius: 2,
        p: 2,
        width: "100%",
        height: "100%",
        ...sx,
      }}
      id={id}
    >
      {children}
    </Box>
  );
}

export default GenericPanel;
