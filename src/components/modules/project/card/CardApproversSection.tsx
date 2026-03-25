"use client";

import { useEffect, useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { CardFormData } from "@/common/schemas/cardSchema";
import { GeneralSize, ButtonVariant } from "@/common/enum";
import { GenericButton, GenericIcon } from "@/components/widgets";
import { Autocomplete, Box, CircularProgress, IconButton, TextField, Typography } from "@mui/material";
import { useTranslation } from "@/common/provider";
import { useProjectMemberSearch } from "@/common/hooks";
import { AutocompleteOption } from "@/common/types/AutoComplete";

interface ApproverRowProps {
  field: { id: string; userId: string; userName: string; environment: string };
  index: number;
  form: UseFormReturn<CardFormData>;
  projectId: number | undefined;
  readOnly: boolean;
  onRemove: (index: number) => void;
}

function ApproverRow({ field, index, form, projectId, readOnly, onRemove }: ApproverRowProps) {
  const { t } = useTranslation();
  const { register, setValue, formState: { errors } } = form;
  const { options, loading, search } = useProjectMemberSearch(projectId);

  // Controlled inputValue prevents MUI from clearing on blur when option isn't in list
  const [inputValue, setInputValue] = useState(field.userName || "");

  // Sync when the form resets (e.g. after save or card reload)
  useEffect(() => {
    setInputValue(field.userName || "");
  }, [field.userName]);

  const envError = errors.approvers?.[index]?.environment?.message;

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}>
      <TextField
        size="small"
        placeholder={t("card.approvers.environment")}
        sx={{ flex: 1 }}
        disabled={readOnly}
        error={!!envError}
        helperText={envError}
        {...register(`approvers.${index}.environment`)}
      />
      {readOnly ? (
        <TextField
          size="small"
          value={field.userName || "—"}
          label={t("card.approvers.assignedUser")}
          disabled
          sx={{ flex: 1 }}
        />
      ) : (
        <Autocomplete
          size="small"
          options={options}
          value={field.userId ? { value: field.userId, label: field.userName || "" } : null}
          inputValue={inputValue}
          loading={loading}
          filterOptions={(x) => x}
          onInputChange={(_, newInputValue, reason) => {
            if (reason === "input") {
              setInputValue(newInputValue);
              search(newInputValue);
            }
            if (reason === "clear") {
              setInputValue("");
              setValue(`approvers.${index}.userId`, "");
              setValue(`approvers.${index}.userName`, "");
            }
          }}
          onChange={(_, newValue: AutocompleteOption | null) => {
            const label = newValue?.label ?? "";
            const value = newValue?.value ?? "";
            setValue(`approvers.${index}.userId`, value);
            setValue(`approvers.${index}.userName`, label);
            setInputValue(label);
          }}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={t("card.approvers.assignedUser")}
              slotProps={{
                input: {
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={16} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                },
              }}
            />
          )}
          sx={{ flex: 1 }}
          slotProps={{ popper: { sx: { zIndex: 3000 } } }}
        />
      )}
      {!readOnly && (
        <IconButton size="small" color="error" onClick={() => onRemove(index)} sx={{ mt: 0.5 }}>
          <GenericIcon icon="delete" size={20} />
        </IconButton>
      )}
    </Box>
  );
}

interface CardApproversSectionProps {
  form: UseFormReturn<CardFormData>;
  projectId: number | undefined;
  readOnly?: boolean;
}

export function CardApproversSection({ form, projectId, readOnly = false }: CardApproversSectionProps) {
  const { t } = useTranslation();
  const { control } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "approvers" });

  const handleAdd = () => {
    append({ id: Date.now(), environment: "", userName: "", userId: "" });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {t("card.approvers.title")}
        </Typography>
        {!readOnly && (
          <GenericButton
            label={t("card.approvers.addApprover")}
            startIcon="add"
            size={GeneralSize.Small}
            variant={ButtonVariant.Outlined}
            onClick={handleAdd}
          />
        )}
      </Box>

      {fields.map((field, index) => (
        <ApproverRow
          key={field.id}
          field={field as { id: string; userId: string; userName: string; environment: string }}
          index={index}
          form={form}
          projectId={projectId}
          readOnly={readOnly}
          onRemove={remove}
        />
      ))}

      {fields.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          {t("card.approvers.noApprovers")}
        </Typography>
      )}
    </Box>
  );
}
