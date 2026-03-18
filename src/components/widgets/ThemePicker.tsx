"use client";

import {
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useThemeMode, useTranslation } from "@/common/provider";
import { COLOR_PRESETS } from "@/common/provider/theme";
import { GenericButton } from "./Button";
import { GenericIcon } from "./Icon";

// ─── Painel principal ─────────────────────────────────────────────────────────

export function ThemePicker() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Tooltip title={t("theme.title")}>
        <IconButton size="small" onClick={() => setOpen(true)}>
          <GenericIcon icon="palette" />
        </IconButton>
      </Tooltip>

      <ThemePickerDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}

// ─── Drawer ───────────────────────────────────────────────────────────────────

function ThemePickerDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const theme = useTheme();
  const { mode, toggleMode, primaryColor, setPrimaryColor } = useThemeMode();
  const { t } = useTranslation();
  const isLight = mode === "light";

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        zIndex: 1600,
        "& .MuiDrawer-paper": {
          width: 300,
          borderLeft: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: "8px",
              background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GenericIcon icon="palette" size={16} />
          </Box>
          <Typography variant="subtitle1" fontWeight={700}>
            {t("theme.title")}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <GenericIcon icon="close" size={18} />
        </IconButton>
      </Box>

      {/* Badge demonstração */}
      <Box sx={{ px: 2.5, pt: 2, flexShrink: 0 }}>
        <Chip
          label={`✦ ${t("theme.demoMode")}`}
          size="small"
          sx={{
            width: "100%",
            borderRadius: 2,
            fontSize: "0.68rem",
            fontWeight: 600,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        />
      </Box>

      {/* Conteúdo com scroll */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, pb: 3 }}>
        {/* Aparência */}
        <SectionTitle>{t("theme.appearance")}</SectionTitle>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
          <ModeCard
            label={t("theme.lightLabel")}
            icon="light_mode"
            selected={isLight}
            onClick={() => !isLight && toggleMode()}
          />
          <ModeCard
            label={t("theme.darkLabel")}
            icon="dark_mode"
            selected={!isLight}
            onClick={() => isLight && toggleMode()}
          />
        </Box>

        <Divider sx={{ my: 2.5 }} />

        {/* Cor primária */}
        <SectionTitle>{t("theme.primaryColor")}</SectionTitle>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 1,
            mb: 1.5,
          }}
        >
          {COLOR_PRESETS.map((preset) => (
            <ColorSwatch
              key={preset.value}
              color={preset.value}
              name={preset.name}
              selected={primaryColor === preset.value}
              onSelect={() => setPrimaryColor(preset.value)}
            />
          ))}
        </Box>
        <CustomColorInput
          value={primaryColor}
          onChange={setPrimaryColor}
          presetValues={COLOR_PRESETS.map((p) => p.value)}
        />

        <Divider sx={{ my: 2.5 }} />

        {/* Preview */}
        <SectionTitle>{t("theme.preview")}</SectionTitle>
        <ComponentPreview />
      </Box>
    </Drawer>
  );
}

// ─── Card de modo (claro / escuro) ────────────────────────────────────────────

function ModeCard({
  label,
  icon,
  selected,
  onClick,
}: {
  label: string;
  icon: string;
  selected: boolean;
  onClick: () => void;
}) {
  const theme = useTheme();

  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0.75,
        p: 1.5,
        borderRadius: 2,
        border: `2px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
        backgroundColor: selected
          ? alpha(theme.palette.primary.main, 0.06)
          : theme.palette.background.default,
        cursor: selected ? "default" : "pointer",
        transition: "all 0.15s ease",
        "&:hover": !selected
          ? {
              borderColor: alpha(theme.palette.primary.main, 0.5),
              backgroundColor: alpha(theme.palette.primary.main, 0.03),
            }
          : {},
      }}
    >
      <GenericIcon
        icon={icon}
        size={22}
        sx={{ color: selected ? theme.palette.primary.main : theme.palette.text.secondary }}
      />
      <Typography
        variant="caption"
        fontWeight={selected ? 700 : 500}
        color={selected ? "primary" : "text.secondary"}
      >
        {label}
      </Typography>
    </Box>
  );
}

// ─── Swatch de cor ────────────────────────────────────────────────────────────

function ColorSwatch({
  color,
  name,
  selected,
  onSelect,
}: {
  color: string;
  name: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <Tooltip title={name} placement="top">
      <Box
        onClick={onSelect}
        sx={{
          width: "100%",
          aspectRatio: "1",
          borderRadius: "50%",
          backgroundColor: color,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: selected ? `3px solid ${alpha(color, 0.4)}` : "3px solid transparent",
          outline: selected ? `2px solid ${color}` : "2px solid transparent",
          outlineOffset: "2px",
          transition: "all 0.15s ease",
          "&:hover": { transform: "scale(1.12)" },
        }}
      >
        {selected && (
          <Box
            component="span"
            className="material-symbols-outlined"
            sx={{ fontSize: 16, color: "#fff", lineHeight: 1 }}
          >
            check
          </Box>
        )}
      </Box>
    </Tooltip>
  );
}

// ─── Input de cor customizada ─────────────────────────────────────────────────

function CustomColorInput({
  value,
  onChange,
  presetValues,
}: {
  value: string;
  onChange: (color: string) => void;
  presetValues: string[];
}) {
  const theme = useTheme();
  const isCustom = !presetValues.includes(value);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        p: 1.25,
        borderRadius: 2,
        border: `1px solid ${isCustom ? theme.palette.primary.main : theme.palette.divider}`,
        backgroundColor: isCustom
          ? alpha(theme.palette.primary.main, 0.05)
          : theme.palette.background.default,
        mt: 0.5,
      }}
    >
      {/* Native color picker */}
      <Box
        component="input"
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          width: 28,
          height: 28,
          border: "none",
          borderRadius: "6px",
          padding: 0,
          cursor: "pointer",
          backgroundColor: "transparent",
          flexShrink: 0,
        }}
      />
      <TextField
        size="small"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v);
        }}
        placeholder="#000000"
        sx={{ flex: 1, "& .MuiInputBase-input": { fontFamily: "monospace", fontSize: "0.8rem" } }}
      />
      {isCustom && (
        <Tooltip title="Cor personalizada">
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: value, flexShrink: 0 }} />
        </Tooltip>
      )}
    </Box>
  );
}

// ─── Preview de componentes ───────────────────────────────────────────────────

function ComponentPreview() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Stack spacing={1.5}>
      {/* Buttons */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <GenericButton label={t("theme.light")} variant="contained" size="small" />
        <GenericButton label={t("theme.dark")} variant="outlined" size="small" />
      </Box>

      {/* Chips */}
      <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
        <Chip label="Tag A" color="primary" size="small" />
        <Chip label="Tag B" size="small" />
        <Chip
          label="Custom"
          size="small"
          sx={{
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            color: theme.palette.primary.main,
            fontWeight: 600,
          }}
        />
      </Box>

      {/* Input */}
      <TextField size="small" placeholder="Exemplo de input..." fullWidth />

      {/* Color strip */}
      <Box
        sx={{
          height: 6,
          borderRadius: 99,
          background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        }}
      />

      {/* Mini card */}
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.primary.main, 0.06),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
        }}
      >
        <Typography variant="caption" color="primary" fontWeight={700}>
          {t("theme.previewCard.title")}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" mt={0.25}>
          {t("theme.previewCard.description")}
        </Typography>
      </Box>
    </Stack>
  );
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: string }) {
  return (
    <Typography
      variant="caption"
      fontWeight={700}
      color="text.secondary"
      sx={{ textTransform: "uppercase", letterSpacing: "0.08em", display: "block", mb: 1.25 }}
    >
      {children}
    </Typography>
  );
}
