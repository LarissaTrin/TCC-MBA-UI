"use client";

import { useState } from "react";
import { useFieldArray, Control } from "react-hook-form";
import { CardFormData } from "@/common/schemas/cardSchema";
import { GenericIcon } from "@/components/widgets";
import { Box, Chip, TextField } from "@mui/material";

interface CardTagsSectionProps {
  control: Control<CardFormData>;
}

export function CardTagsSection({ control }: CardTagsSectionProps) {
  const { fields, append, remove } = useFieldArray({ control, name: "tags" });
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    const exists = fields.some(
      (f) => f.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (!exists) append({ id: Date.now(), name: trimmed });
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 0.5 }}>
      {fields.map((field, index) => (
        <Chip
          key={field.id}
          label={field.name}
          size="small"
          variant="outlined"
          onDelete={() => remove(index)}
          deleteIcon={<GenericIcon icon="close" size={14} />}
          sx={{ height: 22, fontSize: "0.7rem" }}
        />
      ))}
      <TextField
        size="small"
        placeholder="+ tag"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        variant="standard"
        sx={{
          width: inputValue ? 120 : 60,
          transition: "width 0.2s",
          "& .MuiInput-root": { fontSize: "0.75rem" },
          "& .MuiInput-underline:before": { borderBottomColor: "divider" },
        }}
        slotProps={{ htmlInput: { style: { padding: "2px 0" } } }}
      />
    </Box>
  );
}
