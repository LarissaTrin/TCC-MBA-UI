"use client";

import { Box, Chip, Divider, Typography } from "@mui/material";

import { useMyDay } from "@/common/hooks";
import { DashboardCard } from "@/common/services";
import { GenericLoading, DashboardPanel } from "@/components";
import { useTranslation } from "@/common/provider";

function CardRow({ card, locale }: { card: DashboardCard; locale: string }) {
  const formattedDate = card.date
    ? new Date(card.date).toLocaleDateString(locale, { day: "2-digit", month: "2-digit" })
    : null;

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

export function MyDayPanel({ embedded = false }: { embedded?: boolean }) {
  const { t, locale } = useTranslation();
  const { dueToday, overdue, isLoading } = useMyDay();

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
        dueToday.map((c) => <CardRow key={c.id} card={c} locale={locale} />)
      )}

      <Divider sx={{ my: 1.5 }} />

      <Typography variant="subtitle2" color="error" gutterBottom>
        {t("home.myDay.overdue")} {overdue.length > 0 && `(${overdue.length})`}
      </Typography>
      {overdue.length === 0 ? (
        <EmptyState label={t("home.myDay.noOverdue")} />
      ) : (
        overdue.map((c) => <CardRow key={c.id} card={c} locale={locale} />)
      )}
    </>
  );

  if (embedded) return content;

  return <DashboardPanel title={t("home.myDay.title")}>{content}</DashboardPanel>;
}
