import { HTMLInputTypeAttribute } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { GeneralSize } from "@/common/enum";

/**
 * Props for the GenericTextField component.
 * * This is a versatile wrapper around Material-UI's TextField.
 * It can be integrated with React Hook Form by providing the `control` and `name` props,
 * or used as a standard controlled component with `value` and `onChange`.
 */
export interface GenericTextFieldProps <T extends FieldValues>{
  /**
   * The `control` object from React Hook Form's `useForm` hook.
   * Providing this enables automatic form state management.
   * @see https://react-hook-form.com/api/useform/control
   */
  control?: Control<T>;

  /**
   * A unique name to identify the field within the form.
   * Required for React Hook Form integration and standard form submission.
   */
  name: Path<T>;

  /**
   * The text content of the floating label.
   */
  label: string;

  /**
   * The visual style of the text field.
   * @default "outlined"
   */
  variant?: "outlined" | "filled" | "standard";

  /**
   * The default value of the input. Primarily for uncontrolled usage or initial state in RHF.
   */
  defaultValue?: string;

  /**
   * If `true`, the input element will be disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * If `true`, the label will indicate that the input is required.
   * @default false
   */
  required?: boolean;

  /**
   * The type of the `input` element. It should be a valid HTML5 input type.
   * @default "text"
   */
  type?: HTMLInputTypeAttribute;

  /**
   * The controlled value of the input.
   * **Note:** Use this only when not integrating with React Hook Form.
   */
  value?: string;

  /**
   * If `true`, the component will be displayed in an error state.
   * **Note:** This is handled automatically when using React Hook Form.
   * @default false
   */
  error?: boolean;

  /**
   * The helper text content displayed below the input. Useful for instructions or error messages.
   */
  helperText?: string;

  /**
   * If set, the component renders a multiline `textarea`.
   * Defines the number of rows to display.
   */
  rows?: number;

  /**
   * The size of the text field, affecting its height and padding.
   * @default GeneralSize.Medium
   */
  size?: GeneralSize;

  /**
   * If `true`, the `input` element is focused during the first mount.
   * @default false
   */
  autoFocus?: boolean;

  /**
   * Callback fired when the value of the input changes.
   * **Note:** Use this only for standard controlled component usage (when `control` is not provided).
   * @param value The new value of the input.
   */
  onChange?: (value: string) => void;
}