import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { Box, Typography } from "@mui/material";
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
import { GenericIcon, GenericPanel } from "../../widgets";
import { Task, Month } from "../../../common/model/timeline";
import {
  TIMELINE_CONFIG,
  MONTH_NAMES,
} from "../../../common/constants/timeline";
import {
  getDaysDiff,
  generateTimelineMonths,
} from "../../../common/utils/timelineUtils";
import { TimelineTaskBar } from "../../ui/TimelineTaskBar";
import { SidebarSection } from "../../ui/SidebarSection";
import { Status } from "@/common/enum";
import { Card, Section } from "@/common/model";
import { cardService, sectionService } from "@/common/services";

function pickColorByStatus(card: Card): string {
  switch (card.status) {
    case Status.Pending:
      return "#f97316";
    case Status.InProgress:
      return "#3b82f6";
    case Status.Validation:
      return "#eab308";
    case Status.Done:
      return "#10b981";
    default:
      return "#6b7280";
  }
}

export function TimelineContent() {
  const now = useMemo(() => new Date(), []);
  const [months, setMonths] = useState<Month[]>([]);
  const [timelineStartDate, setTimelineStartDate] = useState<Date | null>(null);

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generatedMonths = generateTimelineMonths(now, 1, 4);
    setMonths(generatedMonths);
    if (generatedMonths.length > 0) {
      setTimelineStartDate(
        new Date(generatedMonths[0].year, generatedMonths[0].month, 1)
      );
    }
  }, [now]);

  useEffect(() => {
    Promise.all([sectionService.getSections(), cardService.getAll()]).then(
      ([sectionsApi, cards]) => {
        const orderedSections = [...sectionsApi].sort(
          (a, b) => a.order - b.order
        );
        setSections(orderedSections);

        const mappedTasks: Task[] = cards.map((card) => {
          const start = card.startDate ?? card.dueDate;
          const end = card.endDate ?? card.dueDate;

          return {
            id: card.id,
            title: card.name,
            subtitle: card.status,
            startDate: start,
            endDate: end,
            color: pickColorByStatus(card),
            sectionId: card.sectionId,
            index: card.sortIndex ?? 0,
          };
        });

        setTasks(mappedTasks);
        setLoading(false);
      }
    );
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleTaskUpdate = useCallback(
    (
      taskId: string | number,
      newStart: string,
      newEnd: string,
      newSectionId?: string,
      newIndex?: number
    ) => {
      setTasks((prevTasks) => {
        const taskIndex = prevTasks.findIndex((t) => t.id === taskId);
        if (taskIndex === -1) return prevTasks;
        const currentTask = prevTasks[taskIndex];

        const targetSectionId = newSectionId || currentTask.sectionId;
        const targetIndex =
          newIndex !== undefined ? newIndex : currentTask.index;

        const otherTasks = prevTasks.filter((t) => t.id !== taskId);

        const targetSectionTasks = otherTasks
          .filter((t) => t.sectionId === targetSectionId)
          .sort((a, b) => a.index - b.index);

        const updatedTask = {
          ...currentTask,
          startDate: newStart,
          endDate: newEnd,
          sectionId: targetSectionId,
          index: 0,
        };

        const safeIndex = Math.min(targetIndex, targetSectionTasks.length);
        targetSectionTasks.splice(safeIndex, 0, updatedTask);

        const reindexedTargetSection = targetSectionTasks.map((t, i) => ({
          ...t,
          index: i,
        }));
        const tasksFromOtherSections = otherTasks.filter(
          (t) => t.sectionId !== targetSectionId
        );

        return [...tasksFromOtherSections, ...reindexedTargetSection];
      });
    },
    []
  );

  // --- DND-KIT HANDLERS ---
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setTasks((prevTasks) => {
      const oldGlobalIndex = prevTasks.findIndex((t) => t.id === active.id);
      const task = prevTasks[oldGlobalIndex];
      const sectionId = task.sectionId;

      const sectionTasks = prevTasks
        .filter((t) => t.sectionId === sectionId)
        .sort((a, b) => a.index - b.index);

      const oldIndexInSection = sectionTasks.findIndex(
        (t) => t.id === active.id
      );
      const newIndexInSection = sectionTasks.findIndex((t) => t.id === over.id);

      if (oldIndexInSection === -1 || newIndexInSection === -1)
        return prevTasks;

      const reorderedSection = arrayMove(
        sectionTasks,
        oldIndexInSection,
        newIndexInSection
      );
      const reindexedSection = reorderedSection.map((t, i) => ({
        ...t,
        index: i,
      }));
      const otherTasks = prevTasks.filter((t) => t.sectionId !== sectionId);

      return [...otherTasks, ...reindexedSection];
    });
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
      setTasks((prev) =>
        prev.map((t) =>
          t.id === active.id ? { ...t, sectionId: targetSectionId! } : t
        )
      );
    }
  };

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
    [sections]
  );

  // --- SCROLL AUTOMÁTICO ---
  useEffect(() => {
    if (!initializedRef.current && scrollRef.current && timelineStartDate) {
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);
      const diffDays = getDaysDiff(timelineStartDate, today);

      const containerCenter = scrollRef.current.clientWidth / 2;
      const itemCenter = TIMELINE_CONFIG.dayWidth / 2;
      const scrollPos =
        diffDays * TIMELINE_CONFIG.dayWidth - containerCenter + itemCenter;

      scrollRef.current.scrollLeft = Math.max(scrollPos, 0);
      initializedRef.current = true;
    }
  }, [now, timelineStartDate]);

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
        <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* --- SIDEBAR --- */}
          <Box
            sx={{
              width: TIMELINE_CONFIG.sidebarWidth,
              minWidth: TIMELINE_CONFIG.sidebarWidth,
              borderRight: "1px solid #e0e0e0",
              backgroundColor: "#fff",
              zIndex: 3,
              display: "flex",
              flexDirection: "column",
              boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
            }}
          >
            <Box
              sx={{
                height: TIMELINE_CONFIG.headerHeight,
                borderBottom: "1px solid #e0e0e0",
                p: 2,
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontSize: "1rem", fontWeight: "bold" }}
              >
                Tarefas
              </Typography>
            </Box>
            <Box sx={{ overflowY: "auto", overflowX: "hidden", flex: 1 }}>
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

          {/* --- TIMELINE --- */}
          <Box
            ref={scrollRef}
            sx={{
              flex: 1,
              overflowX: "auto",
              overflowY: "hidden",
              position: "relative",
              backgroundColor: "#f8fafc",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header Timeline */}
            <Box
              sx={{
                display: "flex",
                height: TIMELINE_CONFIG.headerHeight,
                borderBottom: "1px solid #e0e0e0",
                backgroundColor: "#fff",
                position: "sticky",
                top: 0,
                zIndex: 10,
                width: "max-content",
                flexShrink: 0,
              }}
            >
              {months.map((m, i) => (
                <Box key={i} sx={{ borderRight: "1px solid #e0e0e0" }}>
                  <Box
                    sx={{
                      p: 1,
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      color: "#64748b",
                    }}
                  >
                    {MONTH_NAMES[m.month]} {m.year}
                  </Box>
                  <Box sx={{ display: "flex", borderTop: "1px solid #f0f0f0" }}>
                    {m.days.map((d) => (
                      <Box
                        key={d}
                        sx={{
                          width: TIMELINE_CONFIG.dayWidth,
                          textAlign: "center",
                          py: 1,
                          fontSize: "0.75rem",
                          color: "#94a3b8",
                          borderRight: "1px solid #f8fafc",
                        }}
                      >
                        {d}
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Body Timeline */}
            <Box sx={{ position: "relative", width: "max-content", flex: 1 }}>
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
                  }px, #e2e8f0 1px)`,
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
                        bgcolor: "#f1f5f9",
                        borderBottom: "1px solid #e2e8f0",
                        width: "100%",
                        opacity: 0.5,
                        position: "relative",
                        zIndex: 1,
                      }}
                    />
                    {sectionTasks.map((task) => (
                      <Box
                        key={task.id}
                        sx={{
                          height: TIMELINE_CONFIG.rowHeight,
                          borderBottom: "1px solid #e2e8f0",
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
    </DndContext>
  );
}
