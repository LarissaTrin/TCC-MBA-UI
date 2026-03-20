import React, { useMemo, useState } from "react";
import {
  Autocomplete,
  AutocompleteValue,
  Box,
  Checkbox,
  Chip,
  createFilterOptions,
  TextField,
  useTheme,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { AutocompleteOption, GenericAutoCompleteProps } from "@/common/model";
import { MaterialSymbol } from "material-symbols";
import { GenericIcon } from "./Icon";
import { GenericTooltip } from "./Tooltip";
import getSxProps from "@/common/utils/getSxProps";

import * as S from "@/common/styles/components/auto-complete";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

/**
 * `BdtAutoComplete` component implementation.
 */
export function GenericAutoComplete<
  TFieldValues extends FieldValues = FieldValues,
  IsMultiple extends boolean = false,
  FreeSolo extends boolean = false,
>({
  label = "",
  options,
  value,
  defaultValue,
  placeholder,
  onChange,
  sxProps,
  size,
  multiple = false as IsMultiple,
  error = false,
  helperText = "",
  endAdornment,
  tooltipEndAdornment,
  clickEndAdornment,
  hideArrow,
  freeSolo = false as FreeSolo,
  textFieldSx,
  checkboxSelection = false,
  name,
  control,
  textFieldProps,
  ...props
}: GenericAutoCompleteProps<TFieldValues, IsMultiple, FreeSolo>) {
  const theme = useTheme();

  const [open, setOpen] = useState<boolean>(false);

  const filter = createFilterOptions<AutocompleteOption>();

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const renderTypeFieldIcon = (icon?: MaterialSymbol) => {
    if (icon)
      return (
        <GenericIcon
          id={`autocomplete-icon-${icon}`}
          icon={icon}
          //   asButton
          //   color={
          //     theme.palette.mode === ThemeMode.Light
          //       ? "primary.main"
          //       : "secondary.dark"
          //   }
          onClick={clickEndAdornment}
          //   tooltipLabel={tooltipEndAdornment}
        />
      );
  };
  function getOptionValue(option: AutocompleteOption | string | null): string {
    if (!option) return "";
    return typeof option === "string"
      ? option
      : "value" in option
        ? option.value
        : String(option);
  }

  const handleChange = (
    newValue: AutocompleteValue<
      AutocompleteOption,
      IsMultiple,
      false,
      FreeSolo
    >,
  ) => {
    if (multiple) {
      const values = (Array.isArray(newValue) ? newValue : []).map(
        getOptionValue,
      );
      onChange?.(values, Array.isArray(newValue) ? newValue : []);
    } else {
      onChange?.(
        getOptionValue(newValue as AutocompleteOption | string | null),
        newValue ?? null,
      );
    }
  };

  if (control && name) {
    const getAutocompleteValue = (
      fieldValue: unknown,
    ): AutocompleteValue<AutocompleteOption, IsMultiple, false, FreeSolo> => {
      if (multiple) {
        const selectedOptions = (Array.isArray(fieldValue) ? fieldValue : [])
          .map((id) => options.find((opt) => opt.value === String(id)))
          .filter((opt): opt is AutocompleteOption => Boolean(opt));

        return selectedOptions as AutocompleteValue<
          AutocompleteOption,
          IsMultiple,
          false,
          FreeSolo
        >;
      }

      const option =
        options.find((opt) => opt.value === String(fieldValue)) ?? null;

      return option as AutocompleteValue<
        AutocompleteOption,
        IsMultiple,
        false,
        FreeSolo
      >;
    };

    return (
      <Controller
        name={name}
        control={control}
        render={({
          field: { value: fieldValue, onChange: fieldOnChange },
          fieldState,
        }) => {
          return (
            <Autocomplete
              freeSolo={freeSolo}
              multiple={multiple}
              options={options}
              value={getAutocompleteValue(fieldValue)}
              defaultValue={defaultValue}
              size={size}
              sx={{ ...S.autoCompleteStyle(theme), ...getSxProps(sxProps) }}
              onChange={(_, newValue) => {
                const stringValue = multiple
                  ? Array.isArray(newValue)
                    ? newValue.map(getOptionValue)
                    : []
                  : getOptionValue(
                      newValue as AutocompleteOption | string | null,
                    );

                onChange?.(stringValue, newValue);
                fieldOnChange(stringValue);
              }}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              popupIcon={
                hideArrow ? null : <GenericIcon icon="arrow_drop_down" />
              }
              clearIcon={<GenericIcon icon="close" />}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                if (params.inputValue !== "" && filtered.length === 0) {
                  filtered.push({
                    value: "__no_options__",
                    label: "No Options",
                  });
                }
                return filtered;
              }}
              renderOption={
                multiple && checkboxSelection
                  ? (props, option, { selected }) => {
                      const { key, ...optionProps } = props;
                      return (
                        <GenericTooltip key={key} title={option.label}>
                          <li key={key} {...optionProps}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {option.label}
                          </li>
                        </GenericTooltip>
                      );
                    }
                  : (props, option) => {
                      const { key, ...otherProps } = props;
                      if (option.value === "__no_options__") {
                        return (
                          <li
                            key={key}
                            {...otherProps}
                            style={{ pointerEvents: "none", opacity: 0.7 }}
                          >
                            {option.label}
                          </li>
                        );
                      }
                      return (
                        <li key={key} {...otherProps}>
                          {option.label}
                        </li>
                      );
                    }
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={label}
                  placeholder={placeholder}
                  error={!!fieldState.error || error}
                  helperText={fieldState.error?.message || helperText}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            position: "relative",
                            transform: "translate(0,0)",
                            "& .MuiAutocomplete-endAdornment": {
                              position: "relative",
                              height: "inherit",
                              transform: "translate(0,0)",
                            },
                          }}
                        >
                          {params.InputProps.endAdornment}
                          {renderTypeFieldIcon(endAdornment)}
                        </Box>
                      ),
                    },
                  }}
                  sx={{
                    ...textFieldSx,
                    "& .MuiInputBase-root": {
                      pr: "10px !important",
                    },
                  }}
                />
              )}
              renderValue={
                multiple
                  ? (value, getTagProps) => {
                      if (!Array.isArray(value) || value.length === 0)
                        return null;
                      const limitTags = props.limitTags ?? 2;
                      const visibleTags = value.slice(0, limitTags);
                      const hiddenCount = value.length - visibleTags.length;
                      return (
                        <>
                          {visibleTags.map((item, index) => {
                            const label =
                              typeof item === "string"
                                ? item
                                : (item?.label ?? "");
                            return (
                              <GenericTooltip key={index} title={label}>
                                <Chip
                                  {...getTagProps({ index })}
                                  key={index}
                                  label={label}
                                  size="small"
                                  sx={{
                                    maxWidth: "calc(100% - 124px) !important",
                                    top: "-5px",
                                  }}
                                />
                              </GenericTooltip>
                            );
                          })}
                          {hiddenCount > 0 && (
                            <span
                              style={{
                                top: "-5px",
                                marginLeft: "5px",
                                position: "relative",
                              }}
                            >
                              +{hiddenCount}
                            </span>
                          )}
                        </>
                      );
                    }
                  : undefined
              }
              {...props}
              slotProps={{
                ...props.slotProps,
                clearIndicator: {
                  title: "",
                  ...props.slotProps?.clearIndicator,
                },
                popupIndicator: {
                  title: "",
                  ...props.slotProps?.popupIndicator,
                },
                popper: {
                  sx: {
                    zIndex: 3000,
                  },
                },
              }}
            />
          );
        }}
      />
    );
  }

  return (
    <Autocomplete
      freeSolo={freeSolo}
      multiple={multiple}
      options={options}
      sx={{ ...S.autoCompleteStyle(theme), ...getSxProps(sxProps) }}
      onChange={(_, newValue) => handleChange(newValue)}
      defaultValue={defaultValue}
      value={value}
      size={size}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      popupIcon={hideArrow ? null : <GenericIcon icon="arrow_drop_down" />}
      clearIcon={<GenericIcon icon="close" />}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        if (params.inputValue !== "" && filtered.length === 0) {
          filtered.push({
            value: "__no_options__",
            label: "No Options",
          });
        }

        return filtered;
      }}
      renderOption={
        multiple && checkboxSelection
          ? (props, option, { selected }) => {
              const { key, ...optionProps } = props;
              return (
                <GenericTooltip key={key} title={option.label}>
                  <li key={key} {...optionProps}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.label}
                  </li>
                </GenericTooltip>
              );
            }
          : (props, option) => {
              const { key, ...otherProps } = props;

              if (option.value === "__no_options__") {
                return (
                  <li
                    key={key}
                    {...otherProps}
                    style={{ pointerEvents: "none", opacity: 0.7 }}
                  >
                    {option.label}
                  </li>
                );
              }

              return (
                <li key={key} {...otherProps}>
                  {option.label}
                </li>
              );
            }
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    position: "relative",
                    transform: "translate(0,0)",
                    "& .MuiAutocomplete-endAdornment": {
                      position: "relative",
                      height: "inherit",
                      transform: "translate(0,0)",
                    },
                  }}
                >
                  {params.InputProps.endAdornment}
                  {renderTypeFieldIcon(endAdornment)}
                </Box>
              ),
            },
          }}
          sx={{
            ...textFieldSx,
            "& .MuiInputBase-root": {
              pr: "10px !important",
            },
          }}
        />
      )}
      renderValue={
        multiple
          ? (value, getTagProps) => {
              if (!Array.isArray(value) || value.length === 0) return null;

              const limitTags = props.limitTags ?? 2;
              const visibleTags = value.slice(0, limitTags);
              const hiddenCount = value.length - visibleTags.length;

              return (
                <>
                  {visibleTags.map((item, index) => {
                    const label =
                      typeof item === "string" ? item : (item?.label ?? "");
                    return (
                      <GenericTooltip key={index} title={label}>
                        <Chip
                          {...getTagProps({ index })}
                          key={index}
                          label={label}
                          size="small"
                          sx={{
                            maxWidth: "calc(100% - 124px) !important",
                            top: "-5px",
                          }}
                        />
                      </GenericTooltip>
                    );
                  })}
                  {hiddenCount > 0 && (
                    <span
                      style={{
                        top: "-5px",
                        marginLeft: "5px",
                        position: "relative",
                      }}
                    >
                      +{hiddenCount}
                    </span>
                  )}
                </>
              );
            }
          : undefined
      }
      {...props}
      slotProps={{
        ...props.slotProps,
        clearIndicator: {
          title: "",
          ...props.slotProps?.clearIndicator,
        },
        popupIndicator: {
          title: "",
          ...props.slotProps?.popupIndicator,
        },
        popper: {
          sx: {
            zIndex: 3000,
          },
        },
      }}
    />
  );
}
