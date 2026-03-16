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
import { Task, TaskProps, StaticTask } from "@/components/widgets/Task";
import { DroppableContainer } from "@/components/widgets/DroppableContainer";
import { TableView } from "@/components/ui";
import { Section, Task as TaskModel } from "@/common/model";
import { cardService } from "@/common/services";

type KanbanContainers = Record<string, TaskProps[]>;

function mapCardsToBoard(
  sections: Section[],
  cards: TaskModel[],
): KanbanContainers {
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
  const [triggerAddFirst, setTriggerAddFirst] = useState(false);
  const [viewMode, setViewMode] = useState<"board" | "table">("board");

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
      containers[key].some((task) => task?.id === id),
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const id = String(active.id);

    // Procura o card em todas as colunas para garantir que não fique null
    let foundTask = null;
    for (const col of Object.values(containers)) {
      const task = col.find((t) => t?.id === id);
      if (task) {
        foundTask = task;
        break;
      }
    }
    setActiveTask(foundTask);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setContainers((prev) => {
      const activeItems = [...prev[activeContainer]];
      const overItems = [...prev[overContainer]];

      const activeIndex = activeItems.findIndex((t) => t?.id === activeId);
      const overIndex = overItems.findIndex((t) => t?.id === overId);

      // Trava para evitar o bug de id undefined
      if (activeIndex === -1) return prev;
      const movedTask = activeItems[activeIndex];
      if (!movedTask) return prev;

      activeItems.splice(activeIndex, 1);

      let newIndex;
      if (overId in prev) {
        // Soltou na lista vazia
        newIndex = overItems.length;
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current?.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;
        const modifier = isBelowOverItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length;
      }

      overItems.splice(newIndex, 0, movedTask);

      return {
        ...prev,
        [activeContainer]: activeItems,
        [overContainer]: overItems,
      };
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null); // Limpa o overlay independentemente de onde cair

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;

    // Como o onDragOver já moveu de coluna, aqui elas sempre serão iguais
    if (activeContainer === overContainer) {
      const items = [...containers[activeContainer]];
      const activeIndex = items.findIndex((t) => t?.id === activeId);
      let overIndex = items.findIndex((t) => t?.id === overId);

      if (activeIndex === -1) return;

      // Se soltou na coluna vazia, o overIndex é -1, então vai pro final
      if (overIndex === -1) {
        overIndex = items.length - 1;
      }

      let finalItems = items;
      if (activeIndex !== overIndex) {
        finalItems = arrayMove(items, activeIndex, overIndex);
      }

      // filter(Boolean) previne definitivamente que objetos vazios quebrem o .map
      finalItems = finalItems.filter(Boolean).map((item, idx) => ({
        ...item,
        order: idx + 1,
      }));

      setContainers((prev) => ({
        ...prev,
        [activeContainer]: finalItems,
      }));

      // --- MANDA PARA A API ---
      const movedTask = finalItems.find((t) => t.id === activeId);
      if (movedTask) {
        try {
          // Ajuste "update" para o nome do método real da sua API, se for diferente
          await cardService.update(Number(activeId), {
            listId: Number(activeContainer),
            sortIndex: movedTask.order,
          });
        } catch (error) {
          console.error("Erro ao comunicar mudança para a API:", error);
        }
      }
    }
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
          Acesse <strong>Configurações → Listas</strong> para criar suas
          primeiras listas.
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
                  onAddTriggerHandled={
                    index === 0 ? () => setTriggerAddFirst(false) : undefined
                  }
                />
              );
            })}

            {/* O zIndex garante que o DragOverlay passe por cima de tudo e não suma */}
            {mounted &&
              createPortal(
                <DragOverlay zIndex={9999} data-test="drag-overlay">
                  {activeTask ? <StaticTask title={activeTask.title} /> : null}
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
