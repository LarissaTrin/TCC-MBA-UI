import { TextField } from "@mui/material";
import { GenericTextFieldProps } from "@/common/model";

/**
 * Generic and reusable text field component based on Material UI's TextField.
 *
 * This component supports standard props such as label, value, type, and validation.
 * It also supports multiline fields and custom onChange callbacks.
 *
 * @param {string} id - The id of the input element.
 * @param {string} label - The label displayed above the text field.
 * @param {"outlined" | "filled" | "standard"} [variant="outlined"] - The variant of the TextField.
 * @param {string} [defaultValue] - The default value for uncontrolled input.
 * @param {boolean} [disabled] - If true, disables the input.
 * @param {boolean} [required] - If true, marks the field as required.
 * @param {string} [type="text"] - The input type (text, password, email, etc.).
 * @param {string} [value] - The controlled value of the input.
 * @param {boolean} [error] - If true, displays the field in an error state.
 * @param {string} [helperText] - Optional helper text displayed below the input.
 * @param {number} [rows] - Number of rows for multiline input.
 * @param {(value: string) => void} onChangeValue - Callback when the input value changes.
 */
function GenericTextField({
  id,
  label,
  variant = "outlined",
  defaultValue,
  disabled = false,
  required = false,
  type = "text",
  value,
  error = false,
  helperText,
  rows,
  size,
  autoFocus,
  onChangeValue,
}: GenericTextFieldProps) {
  return (
    <TextField
      id={id}
      label={label}
      variant={variant}
      defaultValue={defaultValue}
      disabled={disabled}
      required={required}
      type={type}
      value={value}
      error={error}
      helperText={helperText}
      multiline={!!rows}
      maxRows={rows}
      fullWidth
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        onChangeValue(event.target.value);
      }}
      size={size}
      autoFocus={autoFocus}
    />
  );
}

export default GenericTextField;
