"use client";

import { Box, Chip, Typography } from "@mui/material";

import { DashboardCard } from "@/common/model/dashboard";
import { GenericLoading, DashboardPanel } from "@/components";
import { useTranslation } from "@/common/provider";

function ApprovalRow({ card }: { card: DashboardCard }) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" py={1} gap={1}>
      <Box minWidth={0}>
        <Typography variant="body2" fontWeight="medium" noWrap>
          {card.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {card.projectTitle}
        </Typography>
      </Box>
      <Chip label={card.listName} size="small" color="warning" variant="outlined" />
    </Box>
  );
}

interface PendingApprovalsPanelProps {
  pending: DashboardCard[];
  isLoading: boolean;
  embedded?: boolean;
}

export function PendingApprovalsPanel({ pending, isLoading, embedded = false }: PendingApprovalsPanelProps) {
  const { t } = useTranslation();

  const content = isLoading ? (
    <GenericLoading />
  ) : pending.length === 0 ? (
    <Typography variant="body2" color="text.secondary" textAlign="center" py={1}>
      {t("home.pendingApprovals.none")}
    </Typography>
  ) : (
    pending.map((c) => <ApprovalRow key={c.id} card={c} />)
  );

  if (embedded) return content;

  return <DashboardPanel title={t("home.pendingApprovals.title")}>{content}</DashboardPanel>;
}
