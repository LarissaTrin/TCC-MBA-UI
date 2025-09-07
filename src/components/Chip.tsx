import { Chip } from "@mui/material";

import { GeneralColor, GeneralSize } from "@/common/enum";
import { GenericIcon } from "./Icon";
import { GenericChipProps } from "@/common/model";

/**
 * Generic and reusable chip component based on Material UI's Chip.
 *
 * This component displays a small, clickable element with a label,
 * and optional icons and a delete handler. It uses standardized props
 * to ensure consistent use across the application.
 *
 * @param {string} label - The text to be displayed inside the chip.
 * @param {GeneralColor | "default"} [color] - The color of the chip. Uses the standardized GeneralColor enum with an additional 'default' option.
 * @param {'filled' | 'outlined'} [variant='filled'] - The visual style of the chip.
 * @param {GeneralSize} [size='medium'] - The size of the chip. Maps to 'small' or 'medium' sizes.
 * @param {MaterialSymbol} [startIcon] - An icon to display at the beginning of the chip.
 * @param {MaterialSymbol} [endIcon] - An icon to display at the end of the chip. This icon is typically used with the `onDelete` handler.
 * @param {() => void} [onDelete] - A callback function triggered when the delete icon is clicked.
 */
function GenericBadge({
  label,
  color = GeneralColor.Primary,
  variant = "filled",
  size = GeneralSize.Medium,
  startIcon,
  endIcon,
  onDelete,
}: GenericChipProps) {
  return (
    <Chip
      label={label}
      variant={variant}
      color={color}
      size={size}
      deleteIcon={endIcon ? <GenericIcon icon={endIcon} /> : undefined}
      onDelete={onDelete}
      icon={startIcon ? <GenericIcon icon={startIcon} /> : undefined}
    />
  );
}

export default GenericBadge;
