"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { GenericButton, GenericIcon, GenericPanel } from "../../../widgets";
import { TimelineTaskBar } from "../../../ui/TimelineTaskBar";
import { SidebarSection } from "../../../ui/SidebarSection";

import { Task, Month } from "../../../../common/model/timeline";
import {
  TIMELINE_CONFIG,
  MONTH_NAMES,
} from "../../../../common/constants/timeline";
import {
  getDaysDiff,
  generateTimelineMonths,
} from "../../../../common/utils/timelineUtils";
import { GeneralSize, ButtonVariant } from "@/common/enum";
import { Section } from "@/common/model";
import { cardService } from "@/common/services";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  newCardSchema,
  NewCardFormData,
} from "@/common/schemas/newCardSchema";
import { mapCardsToTasks } from "@/common/utils/cardMapper";
import { useTranslation } from "@/common/provider";


interface TimelineContentProps {
  sections: Section[];
  tasks: Task[];
  loading: boolean;
  setTasks: Dispatch<SetStateAction<Task[]>>;
  setSelectCardId: (cardId: string) => void;
}

export function TimelineContent({
  sections,
  tasks,
  loading: _loading,
  setTasks,
  setSelectCardId: _setSelectCardId,
}: TimelineContentProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const now = useMemo(() => new Date(), []);
  const [months, setMonths] = useState<Month[]>([]);
  const [timelineStartDate, setTimelineStartDate] = useState<Date | null>(null);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const initializedRef = useRef(false);
  // Tracks the target sectionId when a sidebar drag crosses section boundaries
  const sidebarDragTargetSection = useRef<string | null>(null);

  const [newCardOpen, setNewCardOpen] = useState(false);
  const newCardForm = useForm<NewCardFormData>({
    resolver: zodResolver(newCardSchema),
    defaultValues: { title: "" },
  });

  const handleCreateCard = async (data: NewCardFormData) => {
    const firstListId = sections.length > 0 ? Number(sections[0].id) : 0;
    const created = await cardService.create(data.title, firstListId);
    const [mapped] = mapCardsToTasks([created]);
    setTasks((prev) => [...prev, mapped]);
    newCardForm.reset();
    setNewCardOpen(false);
  };

  useEffect(() => {
    const generatedMonths = generateTimelineMonths(now, 1, 6);
    setMonths(generatedMonths);
    if (generatedMonths.length > 0) {
      setTimelineStartDate(
        new Date(generatedMonths[0].year, generatedMonths[0].month, 1),
      );
    }
  }, [now]);


  const totalDays = useMemo(() => {
    return months.reduce((acc, month) => acc + month.days.length, 0);
  }, [months]);

  const totalWidth = totalDays * TIMELINE_CONFIG.dayWidth;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollLeft } = e.currentTarget;
    if (sidebarRef.current) sidebarRef.current.scrollTop = scrollTop;
    if (headerRef.current) headerRef.current.scrollLeft = scrollLeft;
  };

  const handleTaskUpdate = useCallback(
    (
      taskId: string | number,
      newStart: string,
      newEnd: string,
      newSectionId?: string,
      newIndex?: number,
    ) => {
      setTasks((prevTasks) => {
        const taskIndex = prevTasks.findIndex((t) => t.id === taskId);
        if (taskIndex === -1) return prevTasks;
        const task = prevTasks[taskIndex];

        const resolvedSectionId = newSectionId || task.sectionId;
        const resolvedIndex = newIndex !== undefined ? newIndex : task.index;

        const otherTasks = prevTasks.filter((t) => t.id !== taskId);
        const targetSectionTasks = otherTasks
          .filter((t) => t.sectionId === resolvedSectionId)
          .sort((a, b) => a.index - b.index);

        const updatedTask = {
          ...task,
          startDate: newStart,
          endDate: newEnd,
          sectionId: resolvedSectionId,
          index: 0,
        };

        const safeIndex = Math.min(resolvedIndex, targetSectionTasks.length);
        targetSectionTasks.splice(safeIndex, 0, updatedTask);

        const reindexedTargetSection = targetSectionTasks.map((t, i) => ({
          ...t,
          index: i,
        }));
        const tasksFromOtherSections = otherTasks.filter(
          (t) => t.sectionId !== resolvedSectionId,
        );

        return [...tasksFromOtherSections, ...reindexedTargetSection];
      });

      // Always persist dates; always send listId when a section is provided
      // (backend ignores if same list — no history entry written unless it actually changed)
      cardService
        .update(Number(taskId), {
          startDate: newStart,
          endDate: newEnd,
          date: newEnd,
          ...(newSectionId ? { listId: Number(newSectionId) } : {}),
        })
        .catch(console.error);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const getDropLocationAtY = useCallback(
    (y: number) => {
      for (const section of sections) {
        const el = sectionRefs.current[section.id];
        if (el) {
          const rect = el.getBoundingClientRect();
              if (y >= rect.top && y <= rect.bottom) {
            const internalY = y - rect.top - TIMELINE_CONFIG.sectionHeight;
            if (internalY < 0) return { sectionId: section.id, index: 0 };
            const index = Math.floor(internalY / TIMELINE_CONFIG.rowHeight);
            return { sectionId: section.id, index: Math.max(0, index) };
          }
        }
      }
      return null;
    },
    [sections],
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Capture and reset the cross-section target tracked during handleDragOver
    const crossSectionTarget = sidebarDragTargetSection.current;
    sidebarDragTargetSection.current = null;

    if (!over || active.id === over.id) return;

    setTasks((prevTasks) => {
      const oldGlobalIndex = prevTasks.findIndex((t) => t.id === active.id);
      const task = prevTasks[oldGlobalIndex];
      const sectionId = task.sectionId;

      const sectionTasks = prevTasks
        .filter((t) => t.sectionId === sectionId)
        .sort((a, b) => a.index - b.index);

      const oldIndexInSection = sectionTasks.findIndex(
        (t) => t.id === active.id,
      );
      const newIndexInSection = sectionTasks.findIndex((t) => t.id === over.id);

      if (oldIndexInSection === -1 || newIndexInSection === -1)
        return prevTasks;

      const reorderedSection = arrayMove(
        sectionTasks,
        oldIndexInSection,
        newIndexInSection,
      );
      const reindexedSection = reorderedSection.map((t, i) => ({
        ...t,
        index: i,
      }));
      const otherTasks = prevTasks.filter((t) => t.sectionId !== sectionId);

      return [...otherTasks, ...reindexedSection];
    });

    // If card crossed to a different section, persist the new listId
    if (crossSectionTarget) {
      cardService
        .update(Number(active.id), { listId: Number(crossSectionTarget) })
        .catch(console.error);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const isOverSection = sections.some((s) => s.id === over.id);
    const overTask = tasks.find((t) => t.id === over.id);
    let targetSectionId: string | null = null;

    if (isOverSection) targetSectionId = String(over.id);
    else if (overTask) targetSectionId = overTask.sectionId;

    if (targetSectionId && activeTask.sectionId !== targetSectionId) {
      sidebarDragTargetSection.current = targetSectionId;
      setTasks((prev) =>
        prev.map((t) =>
          t.id === active.id ? { ...t, sectionId: targetSectionId! } : t,
        ),
      );
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        !initializedRef.current &&
        scrollRef.current &&
        timelineStartDate &&
        totalWidth > 0
      ) {
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);

        const diffDays = getDaysDiff(timelineStartDate, today);
        const containerCenter = scrollRef.current.clientWidth / 2;

        if (containerCenter === 0) return;

        const itemCenter = TIMELINE_CONFIG.dayWidth / 2;
        const scrollPos =
          diffDays * TIMELINE_CONFIG.dayWidth - containerCenter + itemCenter;

        const finalPos = Math.max(scrollPos, 0);
        scrollRef.current.scrollLeft = finalPos;

        if (headerRef.current) {
          headerRef.current.scrollLeft = finalPos;
        }

        initializedRef.current = true;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [now, timelineStartDate, totalWidth]);

  const todayOffset = useMemo(() => {
    if (!timelineStartDate) return 0;
    const t = new Date(now);
    t.setHours(0, 0, 0, 0);
    return getDaysDiff(timelineStartDate, t) * TIMELINE_CONFIG.dayWidth;
  }, [now, timelineStartDate]);

  if (!timelineStartDate) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <GenericPanel
        sx={{
          p: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "600px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
            zIndex: 10,
          }}
        >
          <Box
            sx={{
              width: TIMELINE_CONFIG.sidebarWidth,
              minWidth: TIMELINE_CONFIG.sidebarWidth,
              height: TIMELINE_CONFIG.headerHeight,
              borderRight: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontSize: "1rem", fontWeight: "bold" }}
            >
              {t("timeline.tasks")}
            </Typography>
            <IconButton
              size="small"
              color="primary"
              onClick={() => setNewCardOpen(true)}
              disabled={sections.length === 0}
            >
              <GenericIcon icon="add" size={20} />
            </IconButton>
          </Box>

          <Box
            ref={headerRef}
            sx={{ flex: 1, overflow: "hidden", display: "flex" }}
          >
            <Box sx={{ display: "flex", width: "max-content" }}>
              {months.map((m, i) => (
                <Box key={i} sx={{ borderRight: "1px solid", borderColor: "divider" }}>
                  <Box
                    sx={{
                      p: 1,
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      color: "text.secondary",
                    }}
                  >
                    {MONTH_NAMES[m.month]} {m.year}
                  </Box>
                  <Box sx={{ display: "flex", borderTop: "1px solid", borderColor: "divider" }}>
                    {m.days.map((d) => (
                      <Box
                        key={d}
                        sx={{
                          width: TIMELINE_CONFIG.dayWidth,
                          textAlign: "center",
                          py: 1,
                          fontSize: "0.75rem",
                          color: "text.disabled",
                          borderRight: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        {d}
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flex: 1,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            ref={sidebarRef}
            sx={{
              width: TIMELINE_CONFIG.sidebarWidth,
              minWidth: TIMELINE_CONFIG.sidebarWidth,
              borderRight: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
              zIndex: 3,
              overflow: "hidden",
              pb: 2,
            }}
          >
            <Box>
              {sections.map((section) => (
                <SidebarSection
                  key={section.id}
                  section={section}
                  tasks={tasks
                    .filter((t) => t.sectionId === section.id)
                    .sort((a, b) => a.index - b.index)}
                />
              ))}
            </Box>
          </Box>

          <Box
            ref={scrollRef}
            onScroll={handleScroll}
            sx={{
              flex: 1,
              overflow: "auto",
              position: "relative",
              backgroundColor: "background.default",
            }}
          >
            <Box
              sx={{
                position: "relative",
                minWidth: totalWidth,
                width: totalWidth,
                minHeight: "100%",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: todayOffset + TIMELINE_CONFIG.dayWidth / 2,
                  top: 0,
                  bottom: 0,
                  width: 2,
                  bgcolor: "#1e90ff",
                  zIndex: 20,
                  pointerEvents: "none",
                }}
              >
                <Box sx={{ position: "absolute", top: -10, left: -9 }}>
                  <GenericIcon
                    icon="arrow_drop_down"
                    sx={{ color: "#1e90ff" }}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `linear-gradient(to right, transparent ${
                    TIMELINE_CONFIG.dayWidth - 1
                  }px, ${theme.palette.divider} 1px)`,
                  backgroundSize: `${TIMELINE_CONFIG.dayWidth}px 100%`,
                  zIndex: 0,
                }}
              />

              {sections.map((section) => {
                const sectionTasks = tasks
                  .filter((t) => t.sectionId === section.id)
                  .sort((a, b) => a.index - b.index);
                return (
                  <Box
                    key={section.id}
                    ref={(el) => {
                      sectionRefs.current[section.id] =
                        el as HTMLDivElement | null;
                    }}
                    sx={{ position: "relative" }}
                  >
                    <Box
                      sx={{
                        height: TIMELINE_CONFIG.sectionHeight,
                        bgcolor: "action.hover",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        width: "100%",
                        opacity: 0.3,
                        position: "relative",
                        zIndex: 1,
                      }}
                    />
                    {sectionTasks.map((task) => (
                      <Box
                        key={task.id}
                        sx={{
                          height: TIMELINE_CONFIG.rowHeight,
                          borderBottom: "1px solid",
                          borderColor: "divider",
                          position: "relative",
                          width: "100%",
                        }}
                      >
                        <TimelineTaskBar
                          task={task}
                          timelineStartDate={timelineStartDate}
                          onUpdate={handleTaskUpdate}
                          getDropLocationAtY={getDropLocationAtY}
                        />
                      </Box>
                    ))}
                    {sectionTasks.length === 0 && <Box sx={{ height: 10 }} />}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </GenericPanel>

      <Dialog
        open={newCardOpen}
        onClose={() => {
          setNewCardOpen(false);
          newCardForm.reset();
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t("timeline.newCard")}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            size="small"
            label={t("timeline.titleLabel")}
            placeholder={t("timeline.titlePlaceholder")}
            sx={{ mt: 1 }}
            error={!!newCardForm.formState.errors.title}
            helperText={newCardForm.formState.errors.title?.message}
            {...newCardForm.register("title")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                newCardForm.handleSubmit(handleCreateCard)();
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <GenericButton
            label={t("common.cancel")}
            variant={ButtonVariant.Text}
            size={GeneralSize.Small}
            onClick={() => {
              setNewCardOpen(false);
              newCardForm.reset();
            }}
          />
          <GenericButton
            label={t("common.create")}
            variant={ButtonVariant.Contained}
            size={GeneralSize.Small}
            onClick={newCardForm.handleSubmit(handleCreateCard)}
            disabled={newCardForm.formState.isSubmitting}
          />
        </DialogActions>
      </Dialog>
    </DndContext>
  );
}
