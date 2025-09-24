import { GeneralSize } from "@/common/enum";

export interface GenericSwitchProps {
  /**
   * The text label displayed next to the switch.
   */
  label: string;
  /**
   * If `true`, the switch is initially checked (uncontrolled).
   */
  defaultChecked?: boolean;
  /**
   * If provided, makes the switch a controlled component.
   */
  checked?: boolean;
  /**
   * The size of the switch. Uses the GeneralSize enum: "small" or "medium".
   * @default GeneralSize.Medium
   */
  size?: GeneralSize;
  /**
   * If `true`, the switch will be disabled.
   */
  disabled?: boolean;
}
