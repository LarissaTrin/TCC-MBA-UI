"use client";

import { Box, Link } from "@mui/material";
import { GenericIcon } from "@/components/widgets";
import { useNavigation } from "@/common/hooks";
import { useTranslation } from "@/common/provider";

export function BackToLogin() {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  return (
    <Box display="flex" justifyContent="center">
      <Link
        component="button"
        type="button"
        variant="body2"
        onClick={() => navigate("/login")}
        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
      >
        <Box component="span" sx={{ textDecoration: "none", lineHeight: 0 }}>
          <GenericIcon icon="arrow_left_alt" size={16} />
        </Box>
        {t("auth.backToLogin")}
      </Link>
    </Box>
  );
}
