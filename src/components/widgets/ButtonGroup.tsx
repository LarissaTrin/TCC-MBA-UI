import { ButtonGroup } from "@mui/material";
import { GenericButtonGroupProps } from "@/common/model";

export function GenericButtonGroup({
  size,
  color,
  variant,
  children,
  ...props
}: GenericButtonGroupProps) {
  return (
    <ButtonGroup size={size} color={color} variant={variant} {...props}>
      {children}
    </ButtonGroup>
  );
}
