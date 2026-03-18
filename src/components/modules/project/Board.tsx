"use client";

import React, { useState, useEffect } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { Box, Button } from "@mui/material";
import { Task, TaskProps } from "@/components/widgets/Task";
import { DroppableContainer } from "@/components/widgets/DroppableContainer";
import { Section, Task as TaskModel } from "@/common/model";
import { cardService } from "@/common/services";
import { TableView } from "@/components/ui";
import { Status } from "@/common/enum";

type KanbanContainers = Record<string, TaskProps[]>;

export function BoardContent({
  sections,
  tasks,
  loading,
  setSelectCardId,
}: {
  sections: Section[];
  tasks: TaskModel[];
  loading: boolean;
  setSelectCardId: (id: string) => void;
}) {
  const [containers, setContainers] = useState<KanbanContainers>({});
  const [triggerAddFirst, setTriggerAddFirst] = useState(false);
  const [viewMode, setViewMode] = useState<"board" | "table">("board");

  // Inicializa os containers baseados nas secções e tasks da API
  useEffect(() => {
    const result: KanbanContainers = {};
    sections.forEach((s) => {
      result[s.id] = [];
    });

    tasks.forEach((card) => {
      if (result[card.sectionId]) {
        result[card.sectionId].push({
          id: String(card.id),
          title: card.title,
          columnId: String(card.sectionId),
          index: card.index,
        });
      }
    });

    // Ordena inicialmente
    Object.keys(result).forEach((key) => {
      result[key].sort((a, b) => a.index - b.index);
    });

    setContainers(result);
  }, [sections, tasks]);

  const handleAddCard = async (sectionId: string, title: string) => {
    const listId = Number(sectionId);
    const created = await cardService.create(title, listId);
    const currentTasks = containers[sectionId] ?? [];
    const newTask: TaskProps = {
      id: String(created.id),
      title: created.name,
      columnId: sectionId,
      index: currentTasks.length,
    };
    setContainers((prev) => ({
      ...prev,
      [sectionId]: [...(prev[sectionId] ?? []), newTask],
    }));
  };

  if (loading) return <Box>Carregando...</Box>;

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
        <Box sx={{ p: 2 }}>
          <DragDropProvider
            onDragOver={(event) => {
              // A função move do @dnd-kit/helpers faz todo o trabalho de reorder e transfer
              setContainers((prev) => move(prev, event));
            }}
            onDragEnd={async (event) => {
              const { active } = event;
              const activeId = String(active.id);

              // Search updated containers state (over.id may be an item ID, not a container ID)
              let destContainerId: string | null = null;
              let newIndex = -1;
              for (const [containerId, items] of Object.entries(containers)) {
                const idx = items.findIndex((t) => t.id === activeId);
                if (idx !== -1) {
                  destContainerId = containerId;
                  newIndex = idx;
                  break;
                }
              }
              if (!destContainerId || newIndex === -1) return;

              const isLastSection =
                sections[sections.length - 1]?.id === destContainerId;
              try {
                await cardService.update(Number(activeId), {
                  listId: Number(destContainerId),
                  sortIndex: newIndex + 1,
                  ...(isLastSection ? { status: Status.Done } : {}),
                });
              } catch (error) {
                console.error("Erro ao salvar posição:", error);
              }
            }}
          >
            <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
              {sections.map((section, idx) => (
                <DroppableContainer
                  key={section.id}
                  id={section.id}
                  title={section.name}
                  activeColapsed={idx === 0 || idx === sections.length - 1}
                  onAddCard={handleAddCard}
                  triggerAdd={idx === 0 ? triggerAddFirst : false}
                  forceExpand={idx === 0 ? triggerAddFirst : false}
                  onAddTriggerHandled={
                    idx === 0 ? () => setTriggerAddFirst(false) : undefined
                  }
                >
                  {(containers[section.id] || []).map((task, index) => (
                    <Task
                      key={task.id}
                      id={task.id}
                      title={task.title}
                      columnId={section.id}
                      index={index}
                      onClick={() => setSelectCardId(task.id)}
                    />
                  ))}
                </DroppableContainer>
              ))}
            </Box>
          </DragDropProvider>
        </Box>
      ) : (
        <TableView containers={containers} setContainers={setContainers} />
      )}
    </Box>
  );
}
