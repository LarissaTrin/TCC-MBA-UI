import { Box, Chip, Typography } from "@mui/material";

import { GeneralColor, GeneralSize } from "@/common/enum";
import { DashboardCard } from "@/common/model/dashboard";
import {
  GenericList,
  GenericLoading,
  GenericChip,
  DashboardPanel,
} from "@/components";
import { useTranslation } from "@/common/provider";

const CATEGORY_COLORS: Record<string, "error" | "success" | "warning" | "primary" | "info" | "secondary" | "default"> = {
  Bug: "error",
  Feature: "success",
  Issue: "warning",
  Task: "primary",
  Enhancement: "info",
  Improvement: "secondary",
};

interface AssignedCardsPanelProps {
  cards: DashboardCard[];
  isLoading: boolean;
  onCardClick: (id: string, projectId: number) => void;
  embedded?: boolean;
}

export function AssignedCardsPanel({
  cards,
  isLoading,
  onCardClick,
  embedded = false,
}: AssignedCardsPanelProps) {
  const { t } = useTranslation();
  function renderCardLabel(card: DashboardCard) {
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <Typography variant="body2" fontWeight="bold">
          {card.title}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5} flexShrink={0}>
          {card.category && (
            <Chip
              label={card.category.name}
              size="small"
              color={CATEGORY_COLORS[card.category.name] ?? "default"}
              sx={{ height: 18, fontSize: "0.65rem" }}
            />
          )}
          <GenericChip
            label={card.listName}
            size={GeneralSize.Small}
            color={GeneralColor.Primary}
          />
        </Box>
      </Box>
    );
  }

  function renderCardList(cards: DashboardCard[]) {
    const items = cards.map((card) => ({
      label: renderCardLabel(card),
      onClick: () => onCardClick(String(card.id), card.projectId),
      secondary: card.listName,
    }));

    return <GenericList items={items} loading={false} collapsed={false} />;
  }

  const content = isLoading ? <GenericLoading /> : renderCardList(cards);

  if (embedded) return content;

  return <DashboardPanel title={t("home.tabs.assignedToMe")}>{content}</DashboardPanel>;
}
