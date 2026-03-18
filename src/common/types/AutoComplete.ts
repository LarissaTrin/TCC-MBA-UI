import type {
  AutocompleteProps,
  AutocompleteValue,
  SxProps,
  TextFieldProps,
  Theme,
} from "@mui/material";
import { MaterialSymbol } from "material-symbols";
import { Control, FieldValues, Path } from "react-hook-form";

/**
 * Represents an option in the autocomplete dropdown.
 *
 * @typedef {Object} AutocompleteOption
 * @property {string} value - Internal value used in the logic.
 * @property {string} label - Display label shown to the user.
 */
export type AutocompleteOption = {
  value: string;
  label: string;
};

/**
 * Props for the GenericAutoCompleteProps component.
 *
 * This component wraps the MUI Autocomplete and provides a simplified API with:
 * - labeled options (value + label)
 * - support for single or multiple selection via a generic
 * - customizable styling through sxProps
 *
 * @template IsMultiple - Indicates whether the component allows multiple selections (true) or not (false).
 */
export type GenericAutoCompleteProps<
  TFieldValues extends FieldValues = FieldValues,
  IsMultiple extends boolean = false,
  FreeSolo extends boolean = false,
> = Omit<
  AutocompleteProps<AutocompleteOption, IsMultiple, false, FreeSolo>,
  "value" | "onChange" | "options" | "renderInput"
> & {
  /**
   * Label displayed on the input field.
   */
  label?: string;

  name?: Path<TFieldValues>;
  control?: Control<TFieldValues>;
  textFieldProps?: TextFieldProps;

  /**
   * List of options available for selection.
   * Each option is rendered as a string.
   */
  options: AutocompleteOption[];

  /**
   * Size of the input field.
   * - 'small'
   * - 'medium' (default)
   */
  size?: "small" | "medium";

  /**
   * Custom styles applied to the component.
   */
  sxProps?: SxProps<Theme>;

  /** Custom styles applied to the TextFieldComponent */
  textFieldSx?: SxProps<Theme>;

  /**
   * Placeholder shown in the input field.
   */
  placeholder?: string;

  /**
   * Enables multiple selection if true.
   *
   * @default false
   */
  multiple?: IsMultiple;

  /**
   * Enables freeSolo selection if true.
   *
   * @default false
   */
  freeSolo?: FreeSolo;

  /**
   * Default selected value(s).
   */
  defaultValue?: AutocompleteOption | AutocompleteOption[] | null;

  /**
   * Current selected value.
   * Should be a string or null (for no selection).
   */
  value?: AutocompleteValue<AutocompleteOption, IsMultiple, false, FreeSolo>;

  /**
   * Callback fired when an option (or multiple) is selected.
   *
   * @param newValue - The new selected value(s).
   * @param fieldOption - The full option object(s) related to the selected value(s).
   */
  onChange?: (
    newValue: string | string[],
    fieldOption?:
      | AutocompleteOption
      | string
      | (AutocompleteOption | string)[]
      | null,
  ) => void;

  /*
   * Turns the field border red if true
   */
  error?: boolean;

  /*
   * It can be used to give instructions or to show the error message
   */
  helperText?: string;
  /**
   * Adornment that goes in the end of the TextField
   */
  endAdornment?: MaterialSymbol;
  /**
   * Tooltip text displayed when hovering over the endAdornment.
   * If not provided, no tooltip will be shown.
   */
  tooltipEndAdornment?: string;

  /**
   * Callback triggered when the endAdornment is clicked.
   */
  clickEndAdornment?: () => void;

  /**
   * If true, hides the tooltip arrow.
   * Defaults to false.
   */
  hideArrow?: boolean;
  /**
   * If true and is multiple, the options for the Autocomplete are going to have checkboxes
   */
  checkboxSelection?: boolean;
};
