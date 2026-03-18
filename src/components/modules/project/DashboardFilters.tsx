"use client";

import { Box, Badge, TextField } from "@mui/material";
import { GenericPopover, GenericButton } from "@/components/widgets";
import { ButtonVariant, GeneralSize } from "@/common/enum";
import { DashboardFilterValues } from "./useDashboardFilters";
import { useTranslation } from "@/common/provider";

interface DashboardFiltersProps {
  draft: DashboardFilterValues;
  isFiltered: boolean;
  onChangeStart: (v: string) => void;
  onChangeEnd: (v: string) => void;
  onApply: () => void;
  onClear: () => void;
}

export function DashboardFilters({
  draft,
  isFiltered,
  onChangeStart,
  onChangeEnd,
  onApply,
  onClear,
}: DashboardFiltersProps) {
  const { t } = useTranslation();

  return (
    <GenericPopover
      reactOpenPopover={
        <Badge color="primary" variant="dot" invisible={!isFiltered}>
          <GenericButton
            startIcon="filter_list"
            label={t("filter.period")}
            variant={ButtonVariant.Outlined}
            size={GeneralSize.Small}
          />
        </Badge>
      }
    >
      <Box sx={{ p: 3, width: 300, display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label={t("filter.start")}
          type="date"
          size="small"
          fullWidth
          value={draft.start}
          onChange={(e) => onChangeStart(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label={t("filter.end")}
          type="date"
          size="small"
          fullWidth
          value={draft.end}
          onChange={(e) => onChangeEnd(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <GenericButton
            label={t("filter.clear")}
            variant={ButtonVariant.Text}
            size={GeneralSize.Small}
            onClick={onClear}
          />
          <GenericButton
            label={t("filter.apply")}
            variant={ButtonVariant.Contained}
            size={GeneralSize.Small}
            startIcon="check"
            onClick={onApply}
          />
        </Box>
      </Box>
    </GenericPopover>
  );
}
