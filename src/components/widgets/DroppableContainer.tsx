"use client";

import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Box } from "@mui/material";
import { Task, TaskProps } from "./Task";
import { useDroppable } from "@dnd-kit/core";
import { GenericAccordion } from "./Accordion";

interface ColumnProps {
  id: string;
  title: string;
  tasks: TaskProps[];
  activeColapsed: boolean;
  onTaskClick?: (id: string) => void;
}

export function DroppableContainer({
  id,
  title,
  tasks,
  activeColapsed,
  onTaskClick
}: ColumnProps) {
  const taskIds = tasks.map((task) => task.id);

  const { setNodeRef, isOver } = useDroppable({ id });

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
          alignItems: tasks.length === 0 ? "center" : "stretch",
          justifyContent: tasks.length === 0 ? "center" : "flex-start",
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
      </Box>
    </GenericAccordion>
  );
}
