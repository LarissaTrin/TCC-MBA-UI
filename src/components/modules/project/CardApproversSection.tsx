"use client";

import { useFieldArray, Control } from "react-hook-form";
import { CardFormData } from "@/common/schemas/cardSchema";
import { GeneralSize, ButtonVariant } from "@/common/enum";
import { GenericButton, GenericIcon } from "@/components/widgets";
import { Autocomplete, Box, IconButton, TextField, Typography } from "@mui/material";

interface CardApproversSectionProps {
  control: Control<CardFormData>;
  memberOptions: { value: string; label: string }[];
}

export function CardApproversSection({ control, memberOptions }: CardApproversSectionProps) {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "approvers",
  });

  const handleAdd = () => {
    append({
      id: Date.now(),
      environment: "",
      userName: "",
      userId: "",
    });
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Approvers
        </Typography>
        <GenericButton
          label="Add Approver"
          startIcon="add"
          size={GeneralSize.Small}
          variant={ButtonVariant.Outlined}
          onClick={handleAdd}
        />
      </Box>

      {fields.map((field, index) => (
        <Box
          key={field.id}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
          }}
        >
          <TextField
            size="small"
            placeholder="Environment"
            value={field.environment}
            onChange={(e) =>
              update(index, { ...field, environment: e.target.value })
            }
            sx={{ flex: 1 }}
          />
          <Autocomplete
            size="small"
            options={memberOptions}
            value={memberOptions.find((o) => o.value === field.userId) ?? null}
            onChange={(_, newValue) =>
              update(index, {
                ...field,
                userId: newValue?.value ?? "",
                userName: newValue?.label ?? "",
              })
            }
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            renderInput={(params) => (
              <TextField {...params} placeholder="Assigned user" />
            )}
            sx={{ flex: 1 }}
          />
          <IconButton
            size="small"
            color="error"
            onClick={() => remove(index)}
          >
            <GenericIcon icon="delete" size={20} />
          </IconButton>
        </Box>
      ))}

      {fields.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No approvers yet.
        </Typography>
      )}
    </Box>
  );
}
