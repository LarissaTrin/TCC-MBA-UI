"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { GenericButton } from "@/components/widgets";
import { ButtonVariant } from "@/common/enum";
import { useTranslation } from "@/common/provider";

interface PolicyModalProps {
  type: "terms" | "privacy";
  open: boolean;
  onClose: () => void;
}

const SECTION_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6"] as const;

export function PolicyModal({ type, open, onClose }: PolicyModalProps) {
  const { t } = useTranslation();
  const title = type === "terms" ? t("auth.policy.termsTitle") : t("auth.policy.privacyTitle");
  const prefix = `auth.policy.${type}`;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" scroll="paper">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {SECTION_KEYS.map((key, index) => (
          <span key={key}>
            <Typography variant="h6" gutterBottom>
              {t(`${prefix}.${key}Title`)}
            </Typography>
            <Typography variant="body2" paragraph={index < SECTION_KEYS.length - 1}>
              {t(`${prefix}.${key}Body`)}
            </Typography>
          </span>
        ))}
      </DialogContent>
      <DialogActions>
        <GenericButton
          label={t("common.close")}
          variant={ButtonVariant.Contained}
          onClick={onClose}
        />
      </DialogActions>
    </Dialog>
  );
}
