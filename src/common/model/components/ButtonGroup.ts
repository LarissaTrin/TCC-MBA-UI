import { ButtonGroupProps } from "@mui/material";
import { GeneralColor, GeneralSize, ButtonVariant } from "@/common/enum";

export interface GenericButtonGroupProps extends ButtonGroupProps {
  /**
   * Group size. Uses the GeneralSize enum.
   * - Small
   * - Medium
   * - Large
   * @default GeneralSize.Medium
   */
  size?: GeneralSize;

  /**
   * Group color. Uses the GeneralColor enum.
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
   * Group variant. Uses the ButtonVariant enum.
   * - Contained
   * - Outlined
   * - Text
   * @default ButtonVariant.Contained
   */
  variant?: ButtonVariant;
}
