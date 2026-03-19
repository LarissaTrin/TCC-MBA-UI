"use client";

import React, { useState, useEffect, useRef } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { Box, Button, Typography } from "@mui/material";
import { Task, TaskProps } from "@/components/widgets/Task";
import { DroppableContainer } from "@/components/widgets/DroppableContainer";
import { Card, Section, Task as TaskModel } from "@/common/model";
import { cardService } from "@/common/services";
import { TableView } from "@/components/ui";
import { Status } from "@/common/enum";
import { useTranslation } from "@/common/provider";

type KanbanContainers = Record<string, TaskProps[]>;

export function BoardContent({
  sections,
  tasks,
  loading,
  setSelectCardId,
  onCardCreated,
}: {
  sections: Section[];
  tasks: TaskModel[];
  loading: boolean;
  setSelectCardId: (id: string) => void;
  onCardCreated?: (card: Card) => void;
}) {
  const { t } = useTranslation();
  const [containers, setContainers] = useState<KanbanContainers>({});
  const containersRef = useRef<KanbanContainers>({});
  const [triggerAddFirst, setTriggerAddFirst] = useState(false);
  const [viewMode, setViewMode] = useState<"board" | "table">("board");

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
          priority: card.priority,
        });
      }
    });

    Object.keys(result).forEach((key) => {
      result[key].sort((a, b) => a.index - b.index);
    });

    containersRef.current = result;
    setContainers(result);
  }, [sections, tasks]);

  const handleAddCard = async (sectionId: string, title: string) => {
    const listId = Number(sectionId);
    const created = await cardService.create(title, listId);
    const currentTasks = containersRef.current[sectionId] ?? [];
    const newTask: TaskProps = {
      id: String(created.id),
      title: created.name,
      columnId: sectionId,
      index: currentTasks.length,
      priority: created.priority,
    };
    setContainers((prev) => {
      const next = { ...prev, [sectionId]: [...(prev[sectionId] ?? []), newTask] };
      containersRef.current = next;
      return next;
    });
    onCardCreated?.(created);
  };

  if (loading) return <Box>{t("common.loading")}</Box>;

  if (sections.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          py: 8,
        }}
      >
        <span className="material-icons" style={{ fontSize: 48, opacity: 0.3 }}>
          view_column
        </span>
        <Typography variant="body1" color="text.secondary" textAlign="center">
          {t("board.noSections")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box justifyContent={"flex-end"} display={"flex"} gap={1}>
        {viewMode === "board" && sections.length > 0 && (
          <Button variant="outlined" onClick={() => setTriggerAddFirst(true)} sx={{ mb: 2 }}>
            {t("project.addCard")}
          </Button>
        )}
        <Button
          variant="contained"
          onClick={() => setViewMode((m) => (m === "board" ? "table" : "board"))}
          sx={{ mb: 2 }}
        >
          {viewMode === "board" ? t("project.tableView") : t("project.boardView")}
        </Button>
      </Box>

      {viewMode === "board" ? (
        <Box sx={{ p: 2 }}>
          <DragDropProvider
            onDragOver={(event) => {
              setContainers((prev) => {
                const next = move(prev, event);
                containersRef.current = next;
                return next;
              });
            }}
            onDragEnd={async (event) => {
              const source = event.operation.source;
              if (!source) return;
              const activeId = String(source.id);

              // Search updated containers state (over.id may be an item ID, not a container ID)
              let destContainerId: string | null = null;
              let newIndex = -1;
              for (const [containerId, items] of Object.entries(containersRef.current)) {
                const idx = items.findIndex((t) => t.id === activeId);
                if (idx !== -1) {
                  destContainerId = containerId;
                  newIndex = idx;
                  break;
                }
              }
              if (!destContainerId || newIndex === -1) return;

              const isLastSection = sections[sections.length - 1]?.id === destContainerId;
              try {
                await cardService.update(Number(activeId), {
                  listId: Number(destContainerId),
                  sortIndex: newIndex + 1,
                  ...(isLastSection ? { status: Status.Done } : {}),
                });
              } catch (error) {
                console.error("Failed to save card position:", error);
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
                  onAddTriggerHandled={idx === 0 ? () => setTriggerAddFirst(false) : undefined}
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
        <TableView containers={containers} setContainers={setContainers} sections={sections} />
      )}
    </Box>
  );
}
