"use client";

import { useFieldArray, Control } from "react-hook-form";
import { CardFormData } from "@/common/schemas/cardSchema";
import { GeneralSize, ButtonVariant } from "@/common/enum";
import { GenericButton, GenericIcon } from "@/components/widgets";
import {
  Box,
  Checkbox,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";

interface CardTasksSectionProps {
  control: Control<CardFormData>;
}

export function CardTasksSection({ control }: CardTasksSectionProps) {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "tasks",
  });

  const handleAdd = () => {
    append({
      id: Date.now(),
      title: "",
      date: "",
      completed: false,
      userName: "",
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
          Tasks
        </Typography>
        <GenericButton
          label="Add Task"
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
          <Checkbox
            checked={field.completed}
            onChange={(e) =>
              update(index, { ...field, completed: e.target.checked })
            }
            size="small"
          />
          <TextField
            size="small"
            placeholder="Task title"
            value={field.title}
            onChange={(e) =>
              update(index, { ...field, title: e.target.value })
            }
            sx={{ flex: 1 }}
          />
          <TextField
            size="small"
            placeholder="Assigned user"
            value={field.userName ?? ""}
            onChange={(e) =>
              update(index, { ...field, userName: e.target.value })
            }
            sx={{ width: 120 }}
          />
          <TextField
            size="small"
            type="date"
            value={field.date ?? ""}
            onChange={(e) =>
              update(index, { ...field, date: e.target.value })
            }
            sx={{ width: 150 }}
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
          No tasks yet.
        </Typography>
      )}
    </Box>
  );
}
