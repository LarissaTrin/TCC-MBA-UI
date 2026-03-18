import { GeneralColor, GeneralSize } from "@/common/enum";
import { MaterialSymbol } from "material-symbols";

export interface GenericChipProps {
  /**
   * The text to be displayed inside the chip.
   */
  label: string;
  /**
   * The color of the chip. Uses the standardized GeneralColor enum
   * and the "default" color option from Material UI.
   * @default "primary"
   */
  color?: GeneralColor | "default";
  /**
   * The visual style of the chip. Can be "filled" or "outlined".
   * @default "filled"
   */
  variant?: "filled" | "outlined";
  /**
   * The size of the chip. Uses the GeneralSize enum: "small" or "medium".
   * @default GeneralSize.Medium
   */
  size?: GeneralSize;
  /**
   * The icon to be displayed at the beginning of the chip.
   * See: https://fonts.google.com/icons
   */
  startIcon?: MaterialSymbol;
  /**
   * The icon to be displayed at the end of the chip. This is typically
   * used with the `onDelete` handler.
   * See: https://fonts.google.com/icons
   */
  endIcon?: MaterialSymbol;
  /**
   * The callback function for the chip's delete event.
   */
  onDelete?: () => void;
}
