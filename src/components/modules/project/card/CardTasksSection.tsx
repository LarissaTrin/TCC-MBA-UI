"use client";

import { useEffect } from "react";
import { useFieldArray, UseFormReturn, useWatch, Control } from "react-hook-form";
import { CardFormData } from "@/common/schemas/cardSchema";
import { GeneralSize, ButtonVariant } from "@/common/enum";
import { GenericButton, GenericIcon } from "@/components/widgets";
import {
  Autocomplete,
  Box,
  Checkbox,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "@/common/provider";
import { useProjectMemberSearch } from "@/common/hooks";

// ─── Sub-component: isolated user search per row ─────────────────────────────

interface TaskUserFieldProps {
  index: number;
  control: Control<CardFormData>;
  projectId?: number;
  initialUserId: string;
  initialUserName: string;
  onUserChange: (userId: string, userName: string) => void;
}

function TaskUserField({
  index,
  control,
  projectId,
  initialUserId,
  initialUserName,
  onUserChange,
}: TaskUserFieldProps) {
  const { t } = useTranslation();
  const { options, loading, search, seedOption } = useProjectMemberSearch(projectId);
  const userId = useWatch({ control, name: `tasks.${index}.userId` });

  useEffect(() => {
    if (initialUserId && initialUserName) {
      seedOption({ value: initialUserId, label: initialUserName });
    }
    // run only on mount to seed the option without re-triggering
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Autocomplete
      size="small"
      options={options}
      value={options.find((o) => o.value === (userId ?? "")) ?? null}
      loading={loading}
      filterOptions={(x) => x}
      onInputChange={(_, value, reason) => {
        if (reason === "input") search(value);
      }}
      onChange={(_, newValue) => {
        onUserChange(newValue?.value ?? "", newValue?.label ?? "");
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
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface CardTasksSectionProps {
  form: UseFormReturn<CardFormData>;
  projectId?: number;
}

export function CardTasksSection({ form, projectId }: CardTasksSectionProps) {
  const { t } = useTranslation();
  const { control, register, setValue } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "tasks" });

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
        <TaskRow
          key={field.id}
          index={index}
          control={control}
          projectId={projectId}
          initialUserId={field.userId ?? ""}
          initialUserName={field.userName ?? ""}
          register={register}
          setValue={setValue}
          onRemove={() => remove(index)}
        />
      ))}

      {fields.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          {t("card.tasks.none")}
        </Typography>
      )}
    </Box>
  );
}

// ─── Row component ────────────────────────────────────────────────────────────

interface TaskRowProps {
  index: number;
  control: Control<CardFormData>;
  projectId?: number;
  initialUserId: string;
  initialUserName: string;
  register: UseFormReturn<CardFormData>["register"];
  setValue: UseFormReturn<CardFormData>["setValue"];
  onRemove: () => void;
}

function TaskRow({
  index,
  control,
  projectId,
  initialUserId,
  initialUserName,
  register,
  setValue,
  onRemove,
}: TaskRowProps) {
  const { t } = useTranslation();
  const completed = useWatch({ control, name: `tasks.${index}.completed` });

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
      <Checkbox
        checked={!!completed}
        onChange={(e) => setValue(`tasks.${index}.completed`, e.target.checked)}
        size="small"
      />
      <TextField
        size="small"
        placeholder={t("card.tasks.titlePlaceholder")}
        sx={{ flex: 1 }}
        {...register(`tasks.${index}.title`)}
      />
      <TaskUserField
        index={index}
        control={control}
        projectId={projectId}
        initialUserId={initialUserId}
        initialUserName={initialUserName}
        onUserChange={(userId, userName) => {
          setValue(`tasks.${index}.userId`, userId);
          setValue(`tasks.${index}.userName`, userName);
        }}
      />
      <TextField
        size="small"
        type="date"
        sx={{ width: 150 }}
        {...register(`tasks.${index}.date`)}
      />
      <IconButton size="small" color="error" onClick={onRemove}>
        <GenericIcon icon="delete" size={20} />
      </IconButton>
    </Box>
  );
}
