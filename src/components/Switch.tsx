import { FormControlLabel, Switch } from "@mui/material";

import { GeneralSize } from "@/common/enum";
import { GenericSwitchProps } from "@/common/model";

/**
 * Generic and reusable switch component based on Material UI's Switch.
 *
 * This component renders a toggle switch with a label,
 * supporting both controlled and uncontrolled states.
 * It uses standardized props to ensure consistent use across the application.
 *
 * @param {string} label - The text label displayed next to the switch.
 * @param {boolean} [defaultChecked] - If `true`, the switch is initially checked (uncontrolled).
 * @param {boolean} [checked] - If provided, makes the switch a controlled component.
 * @param {GeneralSize} [size='medium'] - The size of the switch. Maps to 'small' or 'medium'.
 * @param {boolean} [disabled] - If `true`, the switch will be disabled.
 */
function GenericSwitch({
  label,
  defaultChecked,
  checked,
  size = GeneralSize.Medium,
  disabled,
}: GenericSwitchProps) {
  return (
    <FormControlLabel
      control={
        <Switch
          defaultChecked={defaultChecked}
          checked={checked}
          disabled={disabled}
          size={size}
        />
      }
      label={label}
    />
  );
}

export default GenericSwitch;
