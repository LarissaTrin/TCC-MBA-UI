"use client";

import { useState, useRef } from "react";
import { Box, Badge, TextField, Popover, Typography } from "@mui/material";
import { GenericButton } from "@/components/widgets";
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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleOpen = () => setAnchorEl(triggerRef.current);
  const handleClose = () => {
    setAnchorEl(null);
    setDateError(null);
  };

  const handleApply = () => {
    if (draft.start && draft.end && draft.start > draft.end) {
      setDateError(t("filter.startAfterEnd"));
      return;
    }
    setDateError(null);
    onApply();
    handleClose();
  };

  const handleClear = () => {
    setDateError(null);
    onClear();
    handleClose();
  };

  return (
    <>
      <div ref={triggerRef}>
        <Badge color="primary" variant="dot" invisible={!isFiltered}>
          <GenericButton
            startIcon="filter_list"
            label={t("filter.period")}
            variant={ButtonVariant.Outlined}
            size={GeneralSize.Small}
            onClick={handleOpen}
          />
        </Badge>
      </div>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ zIndex: 3000 }}
      >
        <Box sx={{ p: 3, width: 300, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label={t("filter.start")}
            type="date"
            size="small"
            fullWidth
            value={draft.start}
            onChange={(e) => {
              setDateError(null);
              onChangeStart(e.target.value);
            }}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { max: draft.end || undefined },
            }}
          />
          <TextField
            label={t("filter.end")}
            type="date"
            size="small"
            fullWidth
            value={draft.end}
            onChange={(e) => {
              setDateError(null);
              onChangeEnd(e.target.value);
            }}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { min: draft.start || undefined },
            }}
          />
          {dateError && (
            <Typography variant="caption" color="error">
              {dateError}
            </Typography>
          )}
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <GenericButton
              label={t("filter.clear")}
              variant={ButtonVariant.Text}
              size={GeneralSize.Small}
              onClick={handleClear}
            />
            <GenericButton
              label={t("filter.apply")}
              variant={ButtonVariant.Contained}
              size={GeneralSize.Small}
              startIcon="check"
              onClick={handleApply}
            />
          </Box>
        </Box>
      </Popover>
    </>
  );
}
