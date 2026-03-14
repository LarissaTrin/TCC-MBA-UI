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
import { Box, Button, Typography } from "@mui/material";
import { createPortal } from "react-dom";
import { Task, TaskProps } from "@/components/widgets/Task";
import { DroppableContainer } from "@/components/widgets/DroppableContainer";
import { TableView } from "@/components/ui";
import { Section, Task as TaskModel } from "@/common/model";
import { cardService } from "@/common/services";

type KanbanContainers = Record<string, TaskProps[]>;

function mapCardsToBoard(sections: Section[], cards: TaskModel[]): KanbanContainers {
  const result: KanbanContainers = {};
  sections.forEach((s) => {
    result[s.id] = [];
  });

  cards.forEach((card) => {
    if (!result[card.sectionId]) return;
    result[card.sectionId].push({
      id: String(card.id),
      title: card.title,
      order: card.index,
    });
  });

  Object.keys(result).forEach((key) => {
    result[key] = result[key].sort((a, b) => a.order - b.order);
  });

  return result;
}

interface BoardContentProps {
  sections: Section[];
  tasks: TaskModel[];
  loading: boolean;
  setSelectCardId: (cardId: string) => void;
}

export function BoardContent({
  sections,
  tasks,
  loading,
  setSelectCardId,
}: BoardContentProps) {
  const [containers, setContainers] = useState<KanbanContainers>({});

  const [activeTask, setActiveTask] = useState<TaskProps | null>(null);
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"board" | "table">("board");
  const [triggerAddFirst, setTriggerAddFirst] = useState(false);

  useEffect(() => {
    setContainers(mapCardsToBoard(sections, tasks));
  }, [sections, tasks]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const findContainer = (id: string) => {
    if (id in containers) return id;
    return Object.keys(containers).find((key) =>
      containers[key].some((task) => task.id === id),
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

    if (!activeContainer || !overContainer) {
      setActiveTask(null);
      return;
    }

    if (activeContainer === overContainer) {
      const items = containers[activeContainer];
      const oldIndex = items.findIndex((t) => t.id === activeId);
      const newIndex = items.findIndex((t) => t.id === overId);

      if (oldIndex !== newIndex) {
        const newOrder = arrayMove(items, oldIndex, newIndex).map(
          (item, idx) => ({ ...item, order: idx + 1 }),
        );
        setContainers((prev) => ({
          ...prev,
          [activeContainer]: newOrder,
        }));
      }
    } else {
      // Card movido para outra coluna — persiste novo listId no banco
      cardService.update(Number(activeId), { listId: Number(overContainer) }).catch(console.error);
    }

    setActiveTask(null);
  };

  const handleCardClick = (id: string) => {
    setSelectCardId(id);
  };

  const handleAddCard = async (sectionId: string, title: string) => {
    const listId = Number(sectionId);
    const created = await cardService.create(title, listId);
    const currentTasks = containers[sectionId] ?? [];
    const newTask: TaskProps = {
      id: String(created.id),
      title: created.name,
      order: currentTasks.length,
    };
    setContainers((prev) => ({
      ...prev,
      [sectionId]: [...(prev[sectionId] ?? []), newTask],
    }));
  };

  if (loading) {
    return <Box>Carregando board...</Box>;
  }

  if (sections.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 10,
          gap: 1,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Nenhuma lista criada ainda
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Acesse <strong>Configurações → Listas</strong> para criar suas primeiras listas.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box justifyContent={"flex-end"} display={"flex"} gap={1}>
        {viewMode === "board" && sections.length > 0 && (
          <Button
            variant="outlined"
            onClick={() => setTriggerAddFirst(true)}
            sx={{ mb: 2 }}
          >
            + Add Card
          </Button>
        )}
        <Button
          variant="contained"
          onClick={() =>
            setViewMode((m) => (m === "board" ? "table" : "board"))
          }
          sx={{ mb: 2 }}
        >
          {viewMode === "board" ? "Ver como Tabela" : "Ver como Board"}
        </Button>
      </Box>

      {viewMode === "board" ? (
        <Box sx={{ display: "flex", gap: 3 }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {sections.map((section, index) => {
              const total = sections.length;
              const isFirstOrLast = index === 0 || index === total - 1;
              const tasks = containers[section.id] ?? [];

              return (
                <DroppableContainer
                  key={section.id}
                  id={section.id}
                  title={section.name}
                  tasks={tasks}
                  activeColapsed={isFirstOrLast}
                  onTaskClick={handleCardClick}
                  onAddCard={handleAddCard}
                  triggerAdd={index === 0 ? triggerAddFirst : false}
                  forceExpand={index === 0 ? triggerAddFirst : false}
                  onAddTriggerHandled={index === 0 ? () => setTriggerAddFirst(false) : undefined}
                />
              );
            })}

            {mounted &&
              createPortal(
                <DragOverlay>
                  {activeTask ? (
                    <Task
                      id={activeTask.id}
                      title={activeTask.title}
                      order={activeTask.order}
                    />
                  ) : null}
                </DragOverlay>,
                document.body,
              )}
          </DndContext>
        </Box>
      ) : (
        <TableView containers={containers} setContainers={setContainers} />
      )}
    </Box>
  );
}
