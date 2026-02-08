"use client";

import { Box, Badge, TextField } from "@mui/material";
import { UseFormReturn } from "react-hook-form";
import {
  GenericPopover,
  GenericAutoComplete,
  GenericButton,
} from "@/components/widgets";
import { AutocompleteOption } from "@/common/model";
import { BoardFilterData } from "@/common/schemas/boardFilterSchema";
import { ButtonVariant, GeneralSize } from "@/common/enum";

interface BoardFiltersProps {
  form: UseFormReturn<BoardFilterData>;
  tagOptions: AutocompleteOption[];
  userOptions: AutocompleteOption[];
  isFiltered: boolean;
  onApply: () => void;
  onClear: () => void;
}

export function BoardFilters({
  form,
  tagOptions,
  userOptions,
  isFiltered,
  onApply,
  onClear,
}: BoardFiltersProps) {
  const { control, register } = form;

  return (
    <GenericPopover
      reactOpenPopover={
        <Badge color="primary" variant="dot" invisible={!isFiltered}>
          <GenericButton
            startIcon="filter_list"
            label="Filtros"
            variant={ButtonVariant.Outlined}
            size={GeneralSize.Small}
          />
        </Badge>
      }
    >
      <Box sx={{ p: 3, width: 340, display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label="Buscar"
          placeholder="Título ou ID..."
          size="small"
          fullWidth
          {...register("search")}
        />

        <GenericAutoComplete
          label="Tags"
          placeholder="Selecionar tags..."
          options={tagOptions}
          multiple
          checkboxSelection
          size="small"
          name="tags"
          control={control}
        />

        <GenericAutoComplete
          label="Responsáveis"
          placeholder="Selecionar usuários..."
          options={userOptions}
          multiple
          checkboxSelection
          size="small"
          name="users"
          control={control}
        />

        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            label="Data início"
            type="date"
            size="small"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            {...register("dateFrom")}
          />
          <TextField
            label="Data fim"
            type="date"
            size="small"
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            {...register("dateTo")}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <GenericButton
            label="Limpar"
            variant={ButtonVariant.Text}
            size={GeneralSize.Small}
            onClick={onClear}
          />
          <GenericButton
            label="Filtrar"
            variant={ButtonVariant.Contained}
            size={GeneralSize.Small}
            startIcon="search"
            onClick={onApply}
          />
        </Box>
      </Box>
    </GenericPopover>
  );
}
