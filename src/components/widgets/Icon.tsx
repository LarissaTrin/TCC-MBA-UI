import { Box } from "@mui/material";
import { useState } from "react";

import { GeneralColor, GeneralSize } from "@/common/enum";
import { GenericIconProps } from "@/common/model";
import { iconSizeMap } from "@/common/styles";

/**
 * Generic Material Symbols icon component with customizable size, weight, fill, and hover behavior.
 *
 * This component renders a Material Symbols icon inside a MUI Box. It allows
 * adjusting the icon's font size (via `size`), weight (`wght`), fill (`FILL`),
 * gradient (`GRAD`), and color. Additionally, it supports hover behavior that
 * toggles the fill value if `hoverFill` is true.
 *
 * Props:
 * @param icon - The name of the Material Symbols icon to display.
 * @param size - Optional. Icon size based on GeneralSize enum (Small, Medium, Large).
 *               Maps to pixels: Small = 16, Medium = 20, Large = 28.
 * @param weight - Optional. Weight of the icon (`wght` axis). Default is 400.
 * @param grad - Optional. Gradient value of the icon (`GRAD` axis). Default is 0.
 * @param isFill - Optional. Initial fill value of the icon (`FILL` axis). Default is false.
 * @param activeHover - Optional. If true, the fill value toggles on hover. Default is false.
 * @param color - Optional. Color of the icon. Uses the GeneralColor enum. Default is Primary.
 * @param onClick - Optional. Function to call when the icon is clicked.
 * @param sx - Optional. Custom MUI `sx` styling object.
 *
 * Example usage:
 * ```tsx
 * <GenericIcon
 *   icon="photo_camera"
 *   size={GeneralSize.Large}
 *   weight={700}
 *   isFill={true}
 *   activeHover={true}
 *   color={GeneralColor.Primary}
 *   onClick={() => console.log("Icon clicked")}
 * />
 * ```
 */
export function GenericIcon({
  id = "default-icon",
  icon,
  size = GeneralSize.Medium,
  weight = 400,
  grad = 0,
  isFill = false,
  activeHover = false,
  color = GeneralColor.Primary,
  onClick,
  sx = {},
}: GenericIconProps) {
  const [isHovered, setIsHovered] = useState(false);

  const fontSize = typeof size === "number" ? size : iconSizeMap[size];

  function getCurrentFill(): 0 | 1 {
    let currentFill = isFill ? 1 : 0;

    if (activeHover && isHovered) {
      currentFill = currentFill === 1 ? 0 : 1;
    }

    return currentFill as 0 | 1;
  }

  return (
    <Box
      id={id}
      className="material-symbols-outlined"
      fontSize={fontSize}
      component="span"
      sx={{
        fontVariationSettings: `'FILL' ${getCurrentFill()}, 'wght' ${weight}, 'GRAD' ${grad}`,
        color,
        cursor: onClick ? "pointer" : "default",
        ...sx,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {icon}
    </Box>
  );
}
