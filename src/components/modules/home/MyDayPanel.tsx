"use client";

import { useEffect, useState, useCallback } from "react";
import { Box, Chip, Divider, Typography } from "@mui/material";

import { useLoading } from "@/common/context/LoadingContext";
import { dashboardService, DashboardCard } from "@/common/services";
import { GenericLoading, DashboardPanel } from "@/components";

function CardRow({ card }: { card: DashboardCard }) {
  const formattedDate = card.date
    ? new Date(card.date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      })
    : null;

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
      <Box display="flex" alignItems="center" gap={1} flexShrink={0}>
        {formattedDate && (
          <Typography variant="caption" color="text.secondary">
            {formattedDate}
          </Typography>
        )}
        <Chip label={card.listName} size="small" variant="outlined" />
      </Box>
    </Box>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <Typography variant="body2" color="text.secondary" textAlign="center" py={1}>
      {label}
    </Typography>
  );
}

export function MyDayPanel() {
  const { withLoading } = useLoading();
  const [dueToday, setDueToday] = useState<DashboardCard[]>([]);
  const [overdue, setOverdue] = useState<DashboardCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await withLoading(() => dashboardService.getMyDay());
      setDueToday(data.dueToday);
      setOverdue(data.overdue);
    } catch {
      // silently ignore — panel simply stays empty on error
    } finally {
      setIsLoading(false);
    }
  }, [withLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DashboardPanel title="Meu Dia">
      {isLoading ? (
        <GenericLoading />
      ) : (
        <>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Vence hoje {dueToday.length > 0 && `(${dueToday.length})`}
          </Typography>
          {dueToday.length === 0 ? (
            <EmptyState label="Nenhum card vence hoje" />
          ) : (
            dueToday.map((c) => <CardRow key={c.id} card={c} />)
          )}

          <Divider sx={{ my: 1.5 }} />

          <Typography variant="subtitle2" color="error" gutterBottom>
            Atrasados {overdue.length > 0 && `(${overdue.length})`}
          </Typography>
          {overdue.length === 0 ? (
            <EmptyState label="Nenhum card atrasado" />
          ) : (
            overdue.map((c) => <CardRow key={c.id} card={c} />)
          )}
        </>
      )}
    </DashboardPanel>
  );
}
