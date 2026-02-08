"use client";

import { useState } from "react";
import { useFieldArray, Control } from "react-hook-form";
import { CardFormData } from "@/common/schemas/cardSchema";
import { GeneralSize, ButtonVariant } from "@/common/enum";
import { GenericButton, GenericIcon } from "@/components/widgets";
import {
  Box,
  Chip,
  TextField,
  Typography,
} from "@mui/material";

interface CardTagsSectionProps {
  control: Control<CardFormData>;
}

export function CardTagsSection({ control }: CardTagsSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags",
  });

  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    // Prevent duplicates
    const exists = fields.some(
      (f) => f.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) return;

    append({ id: Date.now(), name: trimmed });
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
        Tags
      </Typography>

      {/* Active tags */}
      {fields.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1.5 }}>
          {fields.map((field, index) => (
            <Chip
              key={field.id}
              label={field.name}
              size="small"
              variant="outlined"
              onDelete={() => remove(index)}
              deleteIcon={<GenericIcon icon="close" size={16} />}
            />
          ))}
        </Box>
      )}

      {/* Input to add new tag */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          size="small"
          placeholder="Add a tag..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{ flex: 1 }}
        />
        <GenericButton
          label="Add"
          size={GeneralSize.Small}
          variant={ButtonVariant.Outlined}
          onClick={handleAdd}
          disabled={!inputValue.trim()}
        />
      </Box>
    </Box>
  );
}
