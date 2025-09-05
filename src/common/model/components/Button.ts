import { ButtonProps } from "@mui/material";

import { GeneralColor, GeneralSize, ButtonVariant } from "@/common/enum";

export interface GenericButtonProps extends ButtonProps {
  /** Text displayed inside the button */
  label: string;
  /** Button size. Uses the GeneralSize enum: Small, Medium, Large */
  size?: GeneralSize;
  /** Button color. Uses the GeneralColor enum: Primary, Secondary, Success, Error, Info, Warning */
  color?: GeneralColor;
  /** Button click handler */
  onClick?: () => void;
  /** Button variant. Uses the ButtonVariant enum: Contained, Outlined, Text */
  variant?: ButtonVariant;
}
