"use client";

import { TextField, TextFieldProps } from "@mui/material";
import { Controller, FieldValues } from "react-hook-form";
import { GenericTextFieldProps } from "@/common/model";

export function GenericTextField<T extends FieldValues>({
  control,
  name,
  label,
  variant = "outlined",
  defaultValue: _defaultValue,
  disabled = false,
  required = false,
  type = "text",
  value,
  error = false,
  helperText,
  rows,
  size,
  autoFocus,
  slotProps,
  onChange,
  ...prop
}: GenericTextFieldProps<T>) {
  const renderTextField = (
    val: string,
    onChangeFn: (val: string) => void,
    err?: boolean,
    helper?: string,
    slotProps?: TextFieldProps["slotProps"],
  ) => {
    return (
      <TextField
        id={name}
        label={label}
        variant={variant}
        disabled={disabled}
        required={required}
        type={type}
        value={val}
        onChange={(e) => onChangeFn(e.target.value)}
        error={!!err}
        helperText={helper}
        multiline={!!rows}
        maxRows={rows}
        fullWidth
        size={size}
        autoFocus={autoFocus}
        slotProps={slotProps}
        {...prop}
      />
    );
  };

  if (control && name) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) =>
          renderTextField(
            field.value ?? "",
            field.onChange,
            !!fieldState.error,
            fieldState.error?.message,
            slotProps,
          )
        }
      />
    );
  }

  return renderTextField(
    value || "",
    onChange || (() => {}),
    error,
    helperText,
    slotProps,
  );
}
