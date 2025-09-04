import { Button } from "@mui/material";

import { ButtonColor, ButtonVariant } from "@/common/enum";
import { GenericButtonProps } from "@/common/model";

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
 * @param color - Optional. Button color, from ButtonColor enum.
 * @param variant - Optional. Button type, from ButtonVariant enum.
 * @param onClick - Optional. Function to call when the button is clicked.
 * @param ...props - All other native Material UI Button props.
 *
 * Example usage:
 * ```tsx
 * <GenericButton
 *   label="Save"
 *   size={ButtonSize.Large}
 *   color={ButtonColor.Primary}
 *   variant={ButtonVariant.Contained}
 *   onClick={() => console.log("Button clicked")}
 *   disabled={false} // from ButtonProps
 * />
 * ```
 */
function BdtButton({
  label,
  size,
  color = ButtonColor.Primary,
  variant = ButtonVariant.Contained,
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
    >
      {label}
    </Button>
  );
}

export default BdtButton;
