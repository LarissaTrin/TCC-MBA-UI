import { MaterialSymbol } from "material-symbols";

import { GeneralColor, GeneralSize, LargeSize } from "@/common/enum";

export interface GenericIconProps {
  /**
   * Name of the Material Symbols icon to display.
   * See: https://fonts.google.com/icons
   */
  icon: MaterialSymbol;

  /**
   * Icon size. Uses the GeneralSize enum.
   * Maps to pixels:
   * - Small = 16px
   * - Medium = 20px (default)
   * - Large = 28px
   *
   * @default GeneralSize.Medium
   */
  size?: GeneralSize | LargeSize | number;

  /**
   * Icon weight (`wght` axis).
   *
   * Possible values:
   * - 100: Thin
   * - 200: Extra Light
   * - 300: Light
   * - 400: Regular (default)
   * - 500: Medium
   * - 600: Semi Bold
   * - 700: Bold
   * - 800: Extra Bold
   * - 900: Black
   *
   * @default 400
   */
  weight?: number;

  /**
   * Icon gradient (`GRAD` axis).
   * Default is 0.
   *
   * @default 0
   */
  grad?: number;

  /**
   * Initial fill (`FILL` axis) of the icon.
   *
   * @default false
   */
  isFill?: boolean;

  /**
   * If true, toggles the fill value on hover.
   *
   * @default false
   */
  activeHover?: boolean;

  /**
   * Icon color. Uses the GeneralColor enum.
   * Possible values:
   * - Primary (default)
   * - Secondary
   * - Success
   * - Error
   * - Info
   * - Warning
   *
   * @default GeneralColor.Primary
   */
  color?: GeneralColor;

  /** Function called when the icon is clicked */
  onClick?: () => void;

  /** Custom MUI `sx` style object */
  sx?: object;
}
