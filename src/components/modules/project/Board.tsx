"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Box } from "@mui/material";
import { createPortal } from "react-dom";
import { Task, TaskProps } from "@/components/widgets/Task";
import { DroppableContainer } from "@/components/widgets/DroppableContainer";

type KanbanContainers = Record<string, TaskProps[]>;

const initialData: KanbanContainers = {
  todo: [
    { id: "1", title: "Tarefa 1" },
    { id: "2", title: "Tarefa 2" },
    { id: "3", title: "Tarefa 3" },
  ],
  inProgress: [
    { id: "4", title: "Tarefa 4" },
    { id: "5", title: "Tarefa 5" },
  ],
  done: [{ id: "6", title: "Tarefa 6" }],
};

export function BoardContent() {
  const [containers, setContainers] = useState<KanbanContainers>(initialData);
  const [activeTask, setActiveTask] = useState<TaskProps | null>(null);
  const [mounted, setMounted] = useState(false); // ✅ novo estado

  useEffect(() => {
    setMounted(true); // ✅ só após o componente montar no client
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const findContainer = (id: string) => {
    if (id in containers) return id;
    return Object.keys(containers).find((key) =>
      containers[key].some((task) => task.id === id)
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const sourceContainer = findContainer(active.id as string);
    if (sourceContainer) {
      const task = containers[sourceContainer].find((t) => t.id === active.id);
      setActiveTask(task || null);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer)
      return;

    setContainers((prev) => {
      const sourceTasks = [...prev[activeContainer]];
      const destTasks = [...prev[overContainer]];
      const activeIndex = sourceTasks.findIndex((t) => t.id === activeId);
      const [movedTask] = sourceTasks.splice(activeIndex, 1);
      destTasks.push(movedTask);
      return {
        ...prev,
        [activeContainer]: sourceTasks,
        [overContainer]: destTasks,
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      setActiveTask(null);
      return;
    }

    const items = containers[activeContainer];
    const oldIndex = items.findIndex((t) => t.id === activeId);
    const newIndex = items.findIndex((t) => t.id === overId);

    if (oldIndex !== newIndex) {
      setContainers((prev) => ({
        ...prev,
        [activeContainer]: arrayMove(items, oldIndex, newIndex),
      }));
    }

    setActiveTask(null);
  };

  return (
    <Box sx={{ display: "flex", gap: 3, p: 3 }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {Object.entries(containers).map(([id, tasks], index) => {
          const total = Object.entries(containers).length;
          const isFirstOrLast = index === 0 || index === total - 1;
          return (
            <DroppableContainer
              key={id}
              id={id}
              title={id.toUpperCase()}
              tasks={tasks}
              activeColapsed={isFirstOrLast}
            />
          );
        })}

        {/* Só renderiza o portal no client */}
        {mounted &&
          createPortal(
            <DragOverlay>
              {activeTask ? (
                <Task id={activeTask.id} title={activeTask.title} />
              ) : null}
            </DragOverlay>,
            document.body
          )}
      </DndContext>
    </Box>
  );
}
