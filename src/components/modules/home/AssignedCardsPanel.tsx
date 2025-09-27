import { Box, Typography } from "@mui/material";

import { GeneralColor, GeneralSize } from "@/common/enum";
import { Card } from "@/common/model";
import {
  GenericList,
  GenericLoading,
  GenericChip,
  DashboardPanel,
} from "@/components";

interface AssignedCardsPanelProps {
  cards: Card[];
  isLoading: boolean;
}

export function AssignedCardsPanel({
  cards,
  isLoading,
}: AssignedCardsPanelProps) {
  function renderCardLabel(card: Card) {
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <Typography variant="body2" fontWeight="bold">
          {card.name}
        </Typography>
        <GenericChip
          label={card.status}
          size={GeneralSize.Small}
          color={
            card.status === "pending"
              ? GeneralColor.Warning
              : card.status === "in_progress"
              ? GeneralColor.Info
              : GeneralColor.Success
          }
        />
      </Box>
    );
  }

  function renderCardList(cards: Card[]) {
    const items = cards.map((card) => ({
      label: renderCardLabel(card),
      onClick: () => console.log("Card clicked:", card.id),
      secondary: card.status,
    }));

    return <GenericList items={items} loading={false} collapsed={false} />;
  }

  return (
    <DashboardPanel title="Assigned to Me">
      {isLoading ? <GenericLoading /> : renderCardList(cards)}
    </DashboardPanel>
  );
}
