import { ButtonProps } from "@mui/material";

import {
  GeneralColor,
  GeneralSize,
  ButtonVariant,
  LargeSize,
} from "@/common/enum";
import { MaterialSymbol } from "material-symbols";

export interface GenericButtonProps extends ButtonProps {
  /**
   * Text displayed inside the button.
   */
  label?: string;

  /**
   * Button size. Uses the GeneralSize enum.
   * - Small
   * - Medium
   * - Large
   * @default GeneralSize.Medium
   */
  size?: GeneralSize | LargeSize;

  /**
   * Button color. Uses the GeneralColor enum.
   * - Inherit
   * - Primary
   * - Secondary
   * - Success
   * - Error
   * - Info
   * - Warning
   * @default GeneralColor.Primary
   */
  color?: GeneralColor;

  /**
   * Button click handler.
   */
  onClick?: () => void;

  /**
   * Button variant. Uses the ButtonVariant enum.
   * - Contained
   * - Outlined
   * - Text
   * @default ButtonVariant.Text
   */
  variant?: ButtonVariant;
  startIcon?: MaterialSymbol;
  loading?: boolean;
}
