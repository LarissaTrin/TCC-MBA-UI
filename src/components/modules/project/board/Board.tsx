"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { Box, Button, Popover, Typography } from "@mui/material";
import { Task, TaskProps } from "@/components/widgets/Task";
import { DroppableContainer } from "@/components/widgets/DroppableContainer";
import { BoardFilters } from "./BoardFilters";
import { useBoardFilters } from "./useBoardFilters";
import { Card, Section, Task as TaskModel } from "@/common/model";
import { cardService, sectionService } from "@/common/services";
import { mapCardsToTasks } from "@/common/utils/cardMapper";
import { TableView } from "@/components/ui";
import { Status } from "@/common/enum";
import { useTranslation } from "@/common/provider";
import { GenericIcon } from "@/components/widgets";
import { ProjectSettingsLists } from "@/components/modules/project/settings/ProjectSettingsLists";

type KanbanContainers = Record<string, TaskProps[]>;

type ListPaginationState = {
  page: number;
  hasMore: boolean;
  loading: boolean;
};

type PaginationMap = Record<string, ListPaginationState>;

export function BoardContent({
  sections,
  loading,
  setSelectCardId,
  projectId,
  lastUpdatedCard,
  userRole,
  onSectionsChange,
  onCardCreated,
}: {
  sections: Section[];
  loading: boolean;
  setSelectCardId: (id: string) => void;
  projectId: number;
  lastUpdatedCard?: Card;
  userRole?: string;
  onSectionsChange?: (sections: Section[]) => void;
  onCardCreated?: (card: Card) => void;
}) {
  const { t } = useTranslation();

  const canManageLists = ["SuperAdmin", "Admin", "Leader"].includes(userRole ?? "");
  const canDeleteLists = ["SuperAdmin", "Admin"].includes(userRole ?? "");

  // All loaded cards per section (source of truth for pagination)
  const [allLoadedCards, setAllLoadedCards] = useState<Record<string, Card[]>>(
    {},
  );
  const [paginationMap, setPaginationMap] = useState<PaginationMap>({});

  // Drag-drop state
  const [containers, setContainers] = useState<KanbanContainers>({});
  const containersRef = useRef<KanbanContainers>({});

  const [triggerAddFirst, setTriggerAddFirst] = useState(false);
  const [viewMode, setViewMode] = useState<"board" | "table">("board");
  const [listsAnchorEl, setListsAnchorEl] = useState<HTMLElement | null>(null);

  // Flat list of all loaded tasks — fed to the filter hook
  const allTasksFlat: TaskModel[] = React.useMemo(
    () => mapCardsToTasks(Object.values(allLoadedCards).flat()),
    [allLoadedCards],
  );

  const {
    form: filterForm,
    filteredTasks,
    isFiltered,
    resetFilters,
    handleApply,
    tagSearch,
    memberSearch,
  } = useBoardFilters(allTasksFlat, projectId);

  // Load cards for a single section
  const loadCards = useCallback(
    async (section: Section, page: number) => {
      setPaginationMap((prev) => ({
        ...prev,
        [section.id]: {
          ...(prev[section.id] ?? { page: 0, hasMore: false }),
          loading: true,
        },
      }));

      try {
        const result = await sectionService.getCardsByList(
          projectId,
          section,
          page,
          20,
        );

        setAllLoadedCards((prev) => {
          const existing = page === 1 ? [] : (prev[section.id] ?? []);
          return { ...prev, [section.id]: [...existing, ...result.cards] };
        });

        setPaginationMap((prev) => ({
          ...prev,
          [section.id]: { page, hasMore: result.hasMore, loading: false },
        }));
      } catch {
        setPaginationMap((prev) => ({
          ...prev,
          [section.id]: {
            ...(prev[section.id] ?? { page: 1, hasMore: false }),
            loading: false,
          },
        }));
      }
    },
    [projectId],
  );

  // Initial load when sections change
  useEffect(() => {
    if (!projectId || sections.length === 0) return;
    setAllLoadedCards({});
    setPaginationMap({});
    sections.forEach((s) => loadCards(s, 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, projectId]);

  // Sync containers from filteredTasks
  useEffect(() => {
    const result: KanbanContainers = {};
    sections.forEach((s) => {
      result[s.id] = [];
    });

    filteredTasks.forEach((task) => {
      const sid = String(task.sectionId);
      if (result[sid]) {
        result[sid].push({
          id: String(task.id),
          cardNumber: task.cardNumber,
          title: task.title,
          columnId: sid,
          index: task.index,
          priority: task.priority,
          tags: task.tags,
          userDisplay: task.userDisplay,
          taskTotal: task.taskTotal,
          taskCompleted: task.taskCompleted,
          blocked: task.blocked,
          sortOrder: task.sortOrder,
        });
      }
    });

    Object.keys(result).forEach((key) => {
      result[key].sort((a, b) => a.index - b.index);
    });

    containersRef.current = result;
    setContainers(result);
  }, [filteredTasks, sections]);

  // Apply card update from drawer save
  useEffect(() => {
    if (!lastUpdatedCard) return;
    setAllLoadedCards((prev) => {
      const sid = lastUpdatedCard.sectionId;
      if (!prev[sid]) return prev;
      return {
        ...prev,
        [sid]: prev[sid].map((c) =>
          c.id === lastUpdatedCard.id ? lastUpdatedCard : c,
        ),
      };
    });
  }, [lastUpdatedCard]);

  const handleAddCard = async (sectionId: string, title: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return;
    const listId = Number(sectionId);
    const created = await cardService.create(title, listId);

    setAllLoadedCards((prev) => {
      const existing = prev[sectionId] ?? [];
      return { ...prev, [sectionId]: [...existing, created] };
    });
    onCardCreated?.(created);
  };

  if (loading) return <Box>{t("common.loading")}</Box>;

  return (
    <Box>
      <Box
        justifyContent={"flex-end"}
        display={"flex"}
        gap={1}
        alignItems="center"
        mb={2}
      >
        {viewMode === "board" && sections.length > 0 && (
          <Button
            variant="outlined"
            onClick={() => setTriggerAddFirst(true)}
          >
            {t("project.addCard")}
          </Button>
        )}
        {canManageLists && (
          <Button
            variant="outlined"
            onClick={(e) => setListsAnchorEl(e.currentTarget)}
          >
            {t("board.manageLists")}
          </Button>
        )}
        <BoardFilters
          form={filterForm}
          tagSearch={tagSearch}
          memberSearch={memberSearch}
          isFiltered={isFiltered}
          onApply={handleApply}
          onClear={resetFilters}
        />
        <Button
          variant="contained"
          onClick={() =>
            setViewMode((m) => (m === "board" ? "table" : "board"))
          }
        >
          {viewMode === "board"
            ? t("project.tableView")
            : t("project.boardView")}
        </Button>
      </Box>

      <Popover
        open={Boolean(listsAnchorEl)}
        anchorEl={listsAnchorEl}
        onClose={() => setListsAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ p: 2, width: 360 }}>
          <ProjectSettingsLists
            projectId={projectId}
            sections={sections}
            onSectionsChange={(updated) => onSectionsChange?.(updated)}
            canDelete={canDeleteLists}
          />
        </Box>
      </Popover>

      {viewMode === "board" ? (
        sections.length === 0 ? (
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
            <GenericIcon icon="view_column" size={48} sx={{ opacity: 0.3 }} />
            <Typography variant="body1" color="text.secondary" textAlign="center">
              {t("board.noSections")}
            </Typography>
          </Box>
        ) : (
        <Box sx={{ p: 2 }}>
          <DragDropProvider
            onDragOver={(event) => {
              setContainers((prev) => {
                const next = move(prev, event);

                // move() returns the same reference when it makes no change.
                // For empty containers the helper can silently no-op, so we
                // handle that case manually.
                if (next === prev) {
                  const { source, target } = event.operation;
                  if (source && target) {
                    const targetId = String(target.id);
                    if (targetId in prev && prev[targetId].length === 0) {
                      const sourceId = String(source.id);
                      let sourceCol: string | null = null;
                      let sourceIdx = -1;
                      for (const [colId, items] of Object.entries(prev)) {
                        const idx = items.findIndex((t) => t.id === sourceId);
                        if (idx !== -1) {
                          sourceCol = colId;
                          sourceIdx = idx;
                          break;
                        }
                      }
                      if (sourceCol !== null && sourceCol !== targetId) {
                        const item = prev[sourceCol][sourceIdx];
                        const updated: KanbanContainers = {
                          ...prev,
                          [sourceCol]: prev[sourceCol].filter(
                            (_, i) => i !== sourceIdx,
                          ),
                          [targetId]: [item],
                        };
                        containersRef.current = updated;
                        return updated;
                      }
                    }
                  }
                }

                containersRef.current = next;
                return next;
              });
            }}
            onDragEnd={async (event) => {
              const source = event.operation.source;
              if (!source) return;
              const activeId = String(source.id);

              let destContainerId: string | null = null;
              let newIndex = -1;
              for (const [containerId, items] of Object.entries(
                containersRef.current,
              )) {
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
                console.error("Failed to save card position:", error);
              }
            }}
          >
            <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
              {sections.map((section, idx) => {
                const pagination = paginationMap[section.id];
                return (
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
                    hasMore={pagination?.hasMore}
                    loadingMore={
                      pagination?.loading &&
                      (allLoadedCards[section.id]?.length ?? 0) > 0
                    }
                    onLoadMore={() =>
                      loadCards(section, (pagination?.page ?? 1) + 1)
                    }
                  >
                    {pagination?.loading &&
                    (allLoadedCards[section.id]?.length ?? 0) === 0 ? (
                      <Box
                        sx={{
                          p: 1,
                          opacity: 0.5,
                          fontSize: "0.8rem",
                          textAlign: "center",
                        }}
                      >
                        {t("common.loading")}
                      </Box>
                    ) : (
                      (containers[section.id] || []).map((task, index) => (
                        <Task
                          key={task.id}
                          id={task.id}
                          cardNumber={task.cardNumber}
                          title={task.title}
                          columnId={section.id}
                          index={index}
                          onClick={() => setSelectCardId(task.id)}
                          tags={task.tags}
                          userDisplay={task.userDisplay}
                          taskTotal={task.taskTotal}
                          taskCompleted={task.taskCompleted}
                          blocked={task.blocked}
                        />
                      ))
                    )}
                  </DroppableContainer>
                );
              })}
            </Box>
          </DragDropProvider>
        </Box>
        )
      ) : (
        <TableView
          containers={containers}
          setContainers={setContainers}
          sections={sections}
          onCardClick={setSelectCardId}
        />
      )}
    </Box>
  );
}
