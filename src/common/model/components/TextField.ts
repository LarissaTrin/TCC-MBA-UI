import { HTMLInputTypeAttribute } from "react";

/**
 * Props for the GenericTextField component.
 */
export interface GenericTextFieldProps {
  /** The id of the input element */
  id: string;

  /** The label displayed above the text field */
  label: string;

  /** The variant of the TextField (outlined, filled, standard)
   * @default "outlined"
   */
  variant?: "outlined" | "filled" | "standard";

  /** The default value for uncontrolled input */
  defaultValue?: string;

  /** If true, disables the input */
  disabled?: boolean;

  /** If true, marks the field as required */
  required?: boolean;

  /** The input type (text, password, email, etc.) */
  type?: HTMLInputTypeAttribute;

  /** The controlled value of the input */
  value?: string;

  /** If true, displays the field in an error state */
  error?: boolean;

  /** Optional helper text displayed below the input */
  helperText?: string;

  /** Number of rows for multiline input */
  rows?: number;

  /** Callback when the input value changes */
  onChangeValue: (value: string) => void;
}
