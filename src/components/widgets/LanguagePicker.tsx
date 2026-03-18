"use client";

import { IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { Language } from "@/common/enum";
import { useTranslation } from "@/common/provider";
import { GenericIcon } from "./Icon";

const LANGUAGE_OPTIONS: { value: Language; flag: string; labelKey: string }[] = [
  { value: Language.EN, flag: "🇺🇸", labelKey: "language.en" },
  { value: Language.PT_BR, flag: "🇧🇷", labelKey: "language.ptBR" },
];

export function LanguagePicker() {
  const { locale, changeLocale, t } = useTranslation();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const current = LANGUAGE_OPTIONS.find((o) => o.value === locale) ?? LANGUAGE_OPTIONS[0];

  return (
    <>
      <Tooltip title={t("language.tooltip")}>
        <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)}>
          <Typography fontSize="1.1rem" lineHeight={1}>
            {current.flag}
          </Typography>
          <GenericIcon icon="arrow_drop_down" size={16} sx={{ ml: 0.25 }} />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {LANGUAGE_OPTIONS.map((opt) => (
          <MenuItem
            key={opt.value}
            selected={opt.value === locale}
            onClick={() => {
              changeLocale(opt.value);
              setAnchor(null);
            }}
            sx={{ gap: 1, minWidth: 160 }}
          >
            <Typography fontSize="1rem">{opt.flag}</Typography>
            <Typography variant="body2">{t(opt.labelKey)}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
