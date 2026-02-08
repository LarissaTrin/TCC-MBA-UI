"use client";

import React, { useState } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Box, TextField, Typography } from "@mui/material";
import { Task, TaskProps } from "./Task";
import { useDroppable } from "@dnd-kit/core";
import { GenericAccordion } from "./Accordion";
import { GenericButton, GenericIcon } from "./";
import { GeneralSize, ButtonVariant } from "@/common/enum";

interface ColumnProps {
  id: string;
  title: string;
  tasks: TaskProps[];
  activeColapsed: boolean;
  onTaskClick?: (id: string) => void;
  onAddCard?: (sectionId: string, title: string) => void;
}

export function DroppableContainer({
  id,
  title,
  tasks,
  activeColapsed,
  onTaskClick,
  onAddCard,
}: ColumnProps) {
  const taskIds = tasks.map((task) => task.id);
  const { setNodeRef, isOver } = useDroppable({ id });

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <GenericAccordion
      orientation="horizontal"
      header={title}
      height={"500px"}
      disableCollapse={!activeColapsed}
    >
      <Box
        ref={setNodeRef}
        sx={{
          flex: 1,
          backgroundColor: isOver ? "#e3f2fd" : "#fff",
          minHeight: 120,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          alignItems: tasks.length === 0 && !isAdding ? "center" : "stretch",
          justifyContent:
            tasks.length === 0 && !isAdding ? "center" : "flex-start",
          transition: "background-color 0.2s ease",
        }}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <Task
              key={task.id}
              id={task.id}
              title={task.title}
              order={task.order}
              onClick={() => onTaskClick?.(task.id)}
            />
          ))}
        </SortableContext>

        {/* ── Inline Add Card ── */}
        {isAdding ? (
          <Box sx={{ p: 1 }}>
            <TextField
              autoFocus
              fullWidth
              size="small"
              placeholder="Enter a title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <GenericButton
                label="Add"
                size={GeneralSize.Small}
                variant={ButtonVariant.Contained}
                onClick={handleSubmit}
                disabled={!newTitle.trim() || isSubmitting}
              />
              <GenericButton
                label="Cancel"
                size={GeneralSize.Small}
                variant={ButtonVariant.Text}
                onClick={handleCancel}
              />
            </Box>
          </Box>
        ) : (
          onAddCard && (
            <Box
              onClick={() => setIsAdding(true)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                p: 1,
                cursor: "pointer",
                borderRadius: 1,
                color: "text.secondary",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                  color: "text.primary",
                },
              }}
            >
              <GenericIcon icon="add" size={18} />
              <Typography variant="body2">Add a card</Typography>
            </Box>
          )
        )}
      </Box>
    </GenericAccordion>
  );
}
