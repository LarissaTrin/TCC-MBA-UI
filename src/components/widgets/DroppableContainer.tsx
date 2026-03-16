"use client";

import React, { useState, useEffect } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Box, TextField } from "@mui/material";
import { Task, TaskProps } from "./Task";
import { useDroppable } from "@dnd-kit/core";
import { GenericAccordion } from "./Accordion";
import { GenericButton } from "./";
import { GeneralSize, ButtonVariant } from "@/common/enum";

interface ColumnProps {
  id: string;
  title: string;
  tasks: TaskProps[];
  activeColapsed: boolean;
  onTaskClick?: (id: string) => void;
  onAddCard?: (sectionId: string, title: string) => void;
  triggerAdd?: boolean;
  forceExpand?: boolean;
  onAddTriggerHandled?: () => void;
}

export function DroppableContainer({
  id,
  title,
  tasks,
  activeColapsed,
  onTaskClick,
  onAddCard,
  triggerAdd,
  forceExpand,
  onAddTriggerHandled,
}: ColumnProps) {
  // Ignora possíveis tarefas corrompidas e pega os ids
  const validTasks = tasks.filter(Boolean);
  const taskIds = validTasks.map((task) => task.id);
  const { setNodeRef, isOver } = useDroppable({ id });

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
    <GenericAccordion
      data-test="droppable-container-accordion"
      orientation="horizontal"
      header={title}
      height={"500px"}
      disableCollapse={!activeColapsed}
      forceExpand={forceExpand}
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
          alignItems:
            validTasks.length === 0 && !isAdding ? "center" : "stretch",
          justifyContent:
            validTasks.length === 0 && !isAdding ? "center" : "flex-start",
          transition: "background-color 0.2s ease",
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
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy} data-test="sortable-context">
          {validTasks.map((task) => (
            <Task
              key={task.id}
              id={task.id}
              title={task.title}
              order={task.order}
              onClick={() => onTaskClick?.(task.id)}
            />
          ))}
        </SortableContext>
      </Box>
    </GenericAccordion>
  );
}
