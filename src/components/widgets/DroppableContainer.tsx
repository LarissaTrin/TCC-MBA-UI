"use client";

import React, { useState, useEffect } from "react";
import { useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from "@dnd-kit/abstract";
import { Box, TextField } from "@mui/material";
import { GenericAccordion } from "./Accordion";
import { GenericButton } from "./";
import { GeneralSize, ButtonVariant } from "@/common/enum";

interface ColumnProps {
  id: string;
  title: string;
  children: React.ReactNode;
  activeColapsed?: boolean;
  onAddCard?: (sectionId: string, title: string) => void;
  triggerAdd?: boolean;
  forceExpand?: boolean;
  onAddTriggerHandled?: () => void;
}

export function DroppableContainer({
  id,
  title,
  children,
  activeColapsed,
  onAddCard,
  triggerAdd,
  forceExpand,
  onAddTriggerHandled,
}: ColumnProps) {
  const { ref } = useDroppable({
    id,
    type: "column",
    accept: ["item"],
    collisionPriority: CollisionPriority.Low,
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (triggerAdd) {
      setIsAdding(true);
      onAddTriggerHandled?.();
    }
  }, [triggerAdd]);

  const handleSubmit = async () => {
    const trimmed = newTitle.trim();
    if (!trimmed || !onAddCard) return;

    setIsSubmitting(true);
    await onAddCard(id, trimmed);
    setNewTitle("");
    setIsAdding(false);
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setNewTitle("");
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div ref={ref}>
    <GenericAccordion
      orientation="horizontal"
      header={title}
      height={"calc(100vh - 240px)"}
      disableCollapse={!activeColapsed}
      forceExpand={forceExpand}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          p: 1,
          minHeight: 200,
          backgroundColor: "rgba(0,0,0,0.02)",
          borderRadius: 2,
        }}
      >
        {isAdding && (
          <Box sx={{ p: 1 }}>
            <TextField
              autoFocus
              fullWidth
              size="small"
              placeholder="Título do card..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <GenericButton
                label="Adicionar"
                size={GeneralSize.Small}
                variant={ButtonVariant.Contained}
                onClick={handleSubmit}
                disabled={!newTitle.trim() || isSubmitting}
              />
              <GenericButton
                label="Cancelar"
                size={GeneralSize.Small}
                variant={ButtonVariant.Text}
                onClick={handleCancel}
              />
            </Box>
          </Box>
        )}
        {children}
      </Box>
    </GenericAccordion>
    </div>
  );
}
