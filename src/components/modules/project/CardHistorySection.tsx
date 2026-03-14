"use client";

import { useEffect, useState } from "react";
import { Box, Chip, Typography } from "@mui/material";

import { cardService, CardHistoryEntry } from "@/common/services";

const ACTION_LABEL: Record<string, string> = {
  moved: "Movido",
  assigned: "Atribuído",
  priority_changed: "Prioridade alterada",
  due_date_changed: "Data alterada",
};

const ACTION_COLOR: Record<
  string,
  "default" | "primary" | "warning" | "info" | "success"
> = {
  moved: "primary",
  assigned: "info",
  priority_changed: "warning",
  due_date_changed: "default",
};

interface CardHistorySectionProps {
  cardId: number;
}

export function CardHistorySection({ cardId }: CardHistorySectionProps) {
  const [history, setHistory] = useState<CardHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    cardService
      .getHistory(cardId)
      .then(setHistory)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [cardId]);

  if (isLoading) {
    return (
      <Typography variant="body2" color="text.secondary">
        Carregando histórico...
      </Typography>
    );
  }

  if (history.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Nenhuma movimentação registrada.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {history.map((entry) => (
        <Box key={entry.id} sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={ACTION_LABEL[entry.action] ?? entry.action}
              size="small"
              color={ACTION_COLOR[entry.action] ?? "default"}
            />
            <Typography variant="caption" color="text.secondary">
              {new Date(entry.createdAt).toLocaleString("pt-BR")}
            </Typography>
          </Box>

          {(entry.oldValue || entry.newValue) && (
            <Typography variant="body2" color="text.secondary" sx={{ pl: 0.5 }}>
              {entry.oldValue}
              {entry.oldValue && entry.newValue && " → "}
              {entry.newValue}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
}
