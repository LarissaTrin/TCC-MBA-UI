import { GeneralColor, DefaultColor } from "@/common/enum";
import { PropsWithChildren } from "react";

export interface GenericBadgeProps extends PropsWithChildren {
  /**
   * The number to be displayed in the badge. Required even if the variant is 'dot'.
   * @default 0
   */
  count?: number;
  /**
   * The color of the badge. Uses the standardized colors from the GeneralColor enum,
   * with the addition of the "default" option.
   * @default GeneralColor.Primary
   */
  color?: GeneralColor | DefaultColor;
  /**
   * The style of the badge. Can be 'standard' (for a count) or 'dot' (for a single point).
   * @default 'standard'
   */
  variant: "standard" | "dot";
}
