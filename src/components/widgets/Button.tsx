import { Button, CircularProgress } from "@mui/material";

import { GeneralColor, ButtonVariant } from "@/common/enum";
import { GenericButtonProps } from "@/common/model";
import { GenericIcon } from "./Icon";

/**
 * Generic reusable button component based on Material UI's Button.
 *
 * This component accepts all props from Material UI's ButtonProps, while also
 * providing strongly-typed enums for size, color, and variant for consistency
 * across the project.
 *
 * Props:
 * @param label - Text shown on the button.
 * @param size - Optional. Button size, from ButtonSize enum.
 * @param color - Optional. Button color, from GeneralColor enum.
 * @param variant - Optional. Button type, from ButtonVariant enum.
 * @param onClick - Optional. Function to call when the button is clicked.
 * @param loading - Optional. Shows a spinner and disables the button.
 * @param ...props - All other native Material UI Button props.
 *
 * Example usage:
 * ```tsx
 * <GenericButton
 *   label="Save"
 *   size={ButtonSize.Large}
 *   color={GeneralColor.Primary}
 *   variant={ButtonVariant.Contained}
 *   onClick={() => console.log("Button clicked")}
 *   disabled={false} // from ButtonProps
 * />
 * ```
 */
export function GenericButton({
  label,
  size,
  color = GeneralColor.Primary,
  variant = ButtonVariant.Contained,
  startIcon,
  loading,
  onClick,
  ...props
}: GenericButtonProps) {
  return (
    <Button
      {...props}
      size={size}
      color={color}
      variant={variant}
      onClick={onClick}
      disabled={!loading && props.disabled}
      startIcon={
        loading ? (
          <CircularProgress size={14} sx={{ color: "#fff" }} />
        ) : startIcon ? (
          <GenericIcon
            icon={startIcon}
            sx={{ cursor: "pointer" }}
          />
        ) : undefined
      }
      sx={{
        ...(label
          ? {}
          : {
              p: 0.5,
              minWidth: "auto",
              "& .MuiButton-startIcon": {
                mr: 0,
              },
            }),
        ...(loading && { pointerEvents: "none" }),
        ...props.sx,
      }}
    >
      {label}
    </Button>
  );
}
