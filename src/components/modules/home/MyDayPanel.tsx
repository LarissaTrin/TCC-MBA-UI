"use client";

import { Box, Chip, Divider, Typography } from "@mui/material";

const CATEGORY_COLORS: Record<string, "error" | "success" | "warning" | "primary" | "info" | "secondary" | "default"> = {
  Bug: "error",
  Feature: "success",
  Issue: "warning",
  Task: "primary",
  Enhancement: "info",
  Improvement: "secondary",
};

import { DashboardCard } from "@/common/model/dashboard";
import { GenericLoading, DashboardPanel } from "@/components";
import { useTranslation } from "@/common/provider";

function CardRow({ card, locale, onClick }: { card: DashboardCard; locale: string; onClick?: () => void }) {
  const formattedDate = card.date
    ? new Date(card.date).toLocaleDateString(locale, { day: "2-digit", month: "2-digit" })
    : null;

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      py={1}
      gap={1}
      onClick={onClick}
      sx={{ cursor: onClick ? "pointer" : "default", borderRadius: 1, "&:hover": onClick ? { bgcolor: "action.hover" } : {} }}
    >
      <Box minWidth={0}>
        <Typography variant="body2" fontWeight="medium" noWrap>
          {card.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {card.projectTitle}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" gap={0.5} flexShrink={0}>
        {formattedDate && (
          <Typography variant="caption" color="text.secondary">
            {formattedDate}
          </Typography>
        )}
        {card.category && (
          <Chip
            label={card.category.name}
            size="small"
            color={CATEGORY_COLORS[card.category.name] ?? "default"}
            sx={{ height: 18, fontSize: "0.65rem" }}
          />
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

interface MyDayPanelProps {
  dueToday: DashboardCard[];
  overdue: DashboardCard[];
  isLoading: boolean;
  onCardClick?: (id: string, projectId: number) => void;
  embedded?: boolean;
}

export function MyDayPanel({ dueToday, overdue, isLoading, onCardClick, embedded = false }: MyDayPanelProps) {
  const { t, locale } = useTranslation();

  const content = isLoading ? (
    <GenericLoading />
  ) : (
    <>
      <Typography variant="subtitle2" color="primary" gutterBottom>
        {t("home.myDay.dueToday")} {dueToday.length > 0 && `(${dueToday.length})`}
      </Typography>
      {dueToday.length === 0 ? (
        <EmptyState label={t("home.myDay.noDueToday")} />
      ) : (
        dueToday.map((c) => <CardRow key={c.id} card={c} locale={locale} onClick={onCardClick ? () => onCardClick(String(c.id), c.projectId) : undefined} />)
      )}

      <Divider sx={{ my: 1.5 }} />

      <Typography variant="subtitle2" color="error" gutterBottom>
        {t("home.myDay.overdue")} {overdue.length > 0 && `(${overdue.length})`}
      </Typography>
      {overdue.length === 0 ? (
        <EmptyState label={t("home.myDay.noOverdue")} />
      ) : (
        overdue.map((c) => <CardRow key={c.id} card={c} locale={locale} onClick={onCardClick ? () => onCardClick(String(c.id), c.projectId) : undefined} />)
      )}
    </>
  );

  if (embedded) return content;

  return <DashboardPanel title={t("home.myDay.title")}>{content}</DashboardPanel>;
}
