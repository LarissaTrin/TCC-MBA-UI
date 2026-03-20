"use client";

import { useEffect } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { CardFormData } from "@/common/schemas/cardSchema";
import { GeneralSize, ButtonVariant } from "@/common/enum";
import { GenericButton, GenericIcon } from "@/components/widgets";
import { Autocomplete, Box, Checkbox, CircularProgress, IconButton, TextField, Typography } from "@mui/material";
import { useTranslation } from "@/common/provider";
import { useProjectMemberSearch } from "@/common/hooks";

interface CardTasksSectionProps {
  form: UseFormReturn<CardFormData>;
  projectId?: number;
}

export function CardTasksSection({ form, projectId }: CardTasksSectionProps) {
  const { t } = useTranslation();
  const { control, register, setValue } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "tasks" });
  const { options, loading, search, seedOption } = useProjectMemberSearch(projectId);

  useEffect(() => {
    fields.forEach((field) => {
      if (field.userId && field.userName) {
        seedOption({ value: field.userId, label: field.userName });
      }
    });
  }, [fields, seedOption]);

  const handleAdd = () => {
    append({ id: Date.now(), title: "", date: "", completed: false, userName: "", userId: "" });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {t("card.tasks.title")}
        </Typography>
        <GenericButton
          label={t("card.tasks.add")}
          startIcon="add"
          size={GeneralSize.Small}
          variant={ButtonVariant.Outlined}
          onClick={handleAdd}
        />
      </Box>

      {fields.map((field, index) => (
        <Box key={field.id} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Checkbox
            checked={field.completed}
            onChange={(e) => setValue(`tasks.${index}.completed`, e.target.checked)}
            size="small"
          />
          <TextField
            size="small"
            placeholder={t("card.tasks.titlePlaceholder")}
            sx={{ flex: 1 }}
            {...register(`tasks.${index}.title`)}
          />
          <Autocomplete
            size="small"
            options={options}
            value={options.find((o) => o.value === field.userId) ?? null}
            loading={loading}
            filterOptions={(x) => x}
            onInputChange={(_, value, reason) => { if (reason === "input") search(value); }}
            onChange={(_, newValue) => {
              setValue(`tasks.${index}.userId`, newValue?.value ?? "");
              setValue(`tasks.${index}.userName`, newValue?.label ?? "");
            }}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={t("card.tasks.assignedUser")}
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
            sx={{ width: 160 }}
            slotProps={{ popper: { sx: { zIndex: 3000 } } }}
          />
          <TextField
            size="small"
            type="date"
            sx={{ width: 150 }}
            {...register(`tasks.${index}.date`)}
          />
          <IconButton size="small" color="error" onClick={() => remove(index)}>
            <GenericIcon icon="delete" size={20} />
          </IconButton>
        </Box>
      ))}

      {fields.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          {t("card.tasks.none")}
        </Typography>
      )}
    </Box>
  );
}
