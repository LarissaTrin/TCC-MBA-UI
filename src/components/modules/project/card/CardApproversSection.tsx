"use client";

import { useEffect } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { CardFormData } from "@/common/schemas/cardSchema";
import { GeneralSize, ButtonVariant } from "@/common/enum";
import { GenericButton, GenericIcon } from "@/components/widgets";
import { Autocomplete, Box, CircularProgress, IconButton, TextField, Typography } from "@mui/material";
import { useTranslation } from "@/common/provider";
import { useProjectMemberSearch } from "@/common/hooks";

interface CardApproversSectionProps {
  form: UseFormReturn<CardFormData>;
  projectId: number | undefined;
  readOnly?: boolean;
}

export function CardApproversSection({ form, projectId, readOnly = false }: CardApproversSectionProps) {
  const { t } = useTranslation();
  const { control, register, setValue, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "approvers" });
  const { options, loading, search, seedOption } = useProjectMemberSearch(projectId);

  // Bug 3: seed de usuários já selecionados para que não sumam ao trocar de aba
  useEffect(() => {
    fields.forEach((field) => {
      if (field.userId && field.userName) {
        seedOption({ value: field.userId, label: field.userName });
      }
    });
  }, [fields, seedOption]);

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

      {fields.map((field, index) => {
        const envError = errors.approvers?.[index]?.environment?.message;
        return (
          <Box key={field.id} sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}>
            {/* Bug 1: register em vez de value+onChange+update para não perder foco */}
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
                value={options.find((o) => o.value === field.userId) ?? null}
                loading={loading}
                filterOptions={(x) => x}
                onInputChange={(_, value, reason) => { if (reason === "input") search(value); }}
                onChange={(_, newValue) => {
                  setValue(`approvers.${index}.userId`, newValue?.value ?? "");
                  setValue(`approvers.${index}.userName`, newValue?.label ?? "");
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
              <IconButton size="small" color="error" onClick={() => remove(index)} sx={{ mt: 0.5 }}>
                <GenericIcon icon="delete" size={20} />
              </IconButton>
            )}
          </Box>
        );
      })}

      {fields.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          {t("card.approvers.noApprovers")}
        </Typography>
      )}
    </Box>
  );
}
