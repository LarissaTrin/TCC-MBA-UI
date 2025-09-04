import { ButtonProps } from "@mui/material";

import { ButtonColor, ButtonSize, ButtonVariant } from "@/common/enum";

export interface GenericButtonProps extends ButtonProps {
  /** Text displayed inside the button */
  label: string;
  /** Button size. Uses the ButtonSize enum: Small, Medium, Large */
  size?: ButtonSize;
  /** Button color. Uses the ButtonColor enum: Primary, Secondary, Success, Error, Info, Warning */
  color?: ButtonColor;
  /** Button click handler */
  onClick?: () => void;
  /** Button variant. Uses the ButtonVariant enum: Contained, Outlined, Text */
  variant?: ButtonVariant;
}
