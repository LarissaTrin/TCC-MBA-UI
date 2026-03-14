"use client";

import { Box, Chip, Typography } from "@mui/material";

import { usePendingApprovals } from "@/common/hooks";
import { DashboardCard } from "@/common/services";
import { GenericLoading, DashboardPanel } from "@/components";

function ApprovalRow({ card }: { card: DashboardCard }) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      py={1}
      gap={1}
    >
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

export function PendingApprovalsPanel() {
  const { pending, isLoading } = usePendingApprovals();

  return (
    <DashboardPanel title="Aprovações Pendentes">
      {isLoading ? (
        <GenericLoading />
      ) : pending.length === 0 ? (
        <Typography variant="body2" color="text.secondary" textAlign="center" py={1}>
          Nenhuma aprovação pendente
        </Typography>
      ) : (
        pending.map((c) => <ApprovalRow key={c.id} card={c} />)
      )}
    </DashboardPanel>
  );
}
