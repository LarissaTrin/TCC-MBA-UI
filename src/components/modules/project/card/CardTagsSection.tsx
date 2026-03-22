"use client";

import { useState } from "react";
import { useFieldArray, Control } from "react-hook-form";
import { CardFormData } from "@/common/schemas/cardSchema";
import { GenericIcon } from "@/components/widgets";
import { Autocomplete, Box, Chip, TextField } from "@mui/material";
import { useProjectTagSearch } from "@/common/hooks";
import { AutocompleteOption } from "@/common/types/AutoComplete";

interface CardTagsSectionProps {
  control: Control<CardFormData>;
  projectId?: number;
}

export function CardTagsSection({ control, projectId }: CardTagsSectionProps) {
  const { fields, append, remove } = useFieldArray({ control, name: "tags" });
  const tagSearch = useProjectTagSearch(projectId);
  const [inputValue, setInputValue] = useState("");

  const addTag = (name: string, id = 0) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (!fields.some((f) => f.name.toLowerCase() === trimmed.toLowerCase())) {
      append({ id, name: trimmed });
    }
    setInputValue("");
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
      <Autocomplete<AutocompleteOption, false, false, true>
        freeSolo
        options={tagSearch.options}
        loading={tagSearch.loading}
        inputValue={inputValue}
        value={null}
        filterOptions={(x) => x}
        onOpen={() => tagSearch.load()}
        onInputChange={(_, value, reason) => {
          if (reason === "input") {
            setInputValue(value);
            tagSearch.search(value);
          } else if (reason === "clear") {
            setInputValue("");
          }
        }}
        onChange={(_, newValue) => {
          if (!newValue) return;
          if (typeof newValue === "string") {
            addTag(newValue);
          } else {
            addTag(newValue.label, Number(newValue.value) || 0);
          }
        }}
        size="small"
        popupIcon={null}
        sx={{
          width: inputValue ? 140 : 70,
          transition: "width 0.2s",
        }}
        slotProps={{
          popper: { sx: { zIndex: 3000 } },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="+ tag"
            variant="standard"
            size="small"
            sx={{
              "& .MuiInput-underline:before": { borderBottomColor: "divider" },
              "& .MuiInputBase-input": { fontSize: "0.75rem", padding: "2px 0" },
            }}
          />
        )}
      />
    </Box>
  );
}
