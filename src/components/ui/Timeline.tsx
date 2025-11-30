import React, { useEffect, useRef, useState, useMemo } from "react";
import { GenericIcon, GenericPanel } from "../widgets"; // Seus componentes existentes
import { Box, Typography } from "@mui/material";

// --- DND KIT IMPORTS ---
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// --- TIPAGEM ---
export interface Task {
  id: number | string;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  color: string;
  sectionId: string; // ID da seção para vincular
}

export interface Section {
  id: string;
  title: string;
}

// --- CONFIGURAÇÕES VISUAIS ---
const CONFIG = {
  sidebarWidth: 260,
  dayWidth: 50,
  rowHeight: 60,
  sectionHeight: 40,
  headerHeight: 80,
};

// --- CONSTANTE DE SEÇÕES (ESTRUTURA FIXA) ---
const SECTIONS: Section[] = [
  { id: "planejamento", title: "Planejamento" },
  { id: "desenvolvimento", title: "Desenvolvimento" },
  { id: "deploy", title: "Deploy / Go Live" },
  { id: "qa", title: "Quality Assurance (Vazio)" },
];

// --- HELPERS DE DATA ---
function generateTimeline(now = new Date(), monthsBefore = 1, monthsAfter = 3) {
  const months = [];
  const start = new Date(now.getFullYear(), now.getMonth() - monthsBefore, 1);
  const iter = new Date(start);

  for (let i = 0; i < monthsBefore + monthsAfter + 1; i++) {
    const year = iter.getFullYear();
    const month = iter.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    months.push({
      year,
      month,
      days: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      startDate: new Date(year, month, 1),
    });
    iter.setMonth(month + 1);
  }
  return months;
}

const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const getDaysDiff = (start: Date, end: Date) => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((end.getTime() - start.getTime()) / oneDay);
};

// ============================================================================
// COMPONENTE: ITEM DA TAREFA (SIDEBAR - DRAGGABLE)
// ============================================================================
interface SortableSidebarItemProps {
  task: Task;
}

function SortableSidebarItem({ task }: SortableSidebarItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : "auto",
    backgroundColor: isDragging ? "#f0f9ff" : "white",
    position: "relative" as const,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{
        height: CONFIG.rowHeight,
        borderBottom: "1px solid #f0f0f0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        px: 2,
        cursor: "grab",
        "&:active": { cursor: "grabbing" },
        touchAction: "none",
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>
        {task.title}
      </Typography>
      <Typography variant="caption" sx={{ color: "#64748b" }}>
        {task.subtitle}
      </Typography>
    </Box>
  );
}

// ============================================================================
// COMPONENTE: CONTAINER DA SEÇÃO (SIDEBAR - DROPPABLE)
// ============================================================================
interface SidebarSectionProps {
  section: Section;
  tasks: Task[];
}

function SidebarSection({ section, tasks }: SidebarSectionProps) {
  // Tornamos a seção inteira uma área de drop.
  // Isso permite soltar itens aqui mesmo que a lista esteja vazia.
  const { setNodeRef } = useDroppable({
    id: section.id,
  });

  return (
    <Box ref={setNodeRef} sx={{ display: "flex", flexDirection: "column" }}>
      {/* Cabeçalho da Seção */}
      <Box
        sx={{
          height: CONFIG.sectionHeight,
          backgroundColor: "#f1f5f9",
          display: "flex",
          alignItems: "center",
          px: 2,
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#475569" }}
        >
          {section.title}
        </Typography>
      </Box>

      {/* Lista de Tarefas Sortable */}
      <Box sx={{ minHeight: 0 }}>
        <SortableContext
          id={section.id} // Importante: Contexto isolado por seção ajuda na lógica
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <SortableSidebarItem key={task.id} task={task} />
          ))}
        </SortableContext>
        
        {/* Espaço vazio mínimo para garantir drop visual se necessário, 
            mas o header já serve como alvo graças ao useDroppable no pai */}
      </Box>
    </Box>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export function TimelineCalendar() {
  const now = useMemo(() => new Date(), []);
  const months = useMemo(() => generateTimeline(now, 1, 4), [now]);
  
  const timelineStartDate = useMemo(() => {
    return new Date(months[0].year, months[0].month, 1);
  }, [months]);

  // --- ESTADO DAS TAREFAS ---
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Definição de Escopo", subtitle: "Reunião", startDate: "2025-11-28", endDate: "2025-12-02", color: "#3b82f6", sectionId: "planejamento" },
    { id: 2, title: "Orçamento", subtitle: "Financeiro", startDate: "2025-12-03", endDate: "2025-12-05", color: "#3b82f6", sectionId: "planejamento" },
    { id: 3, title: "Backend API", subtitle: "Python/FastAPI", startDate: "2025-12-01", endDate: "2025-12-15", color: "#10b981", sectionId: "desenvolvimento" },
    { id: 4, title: "Frontend Dashboard", subtitle: "React + MUI", startDate: "2025-12-10", endDate: "2025-12-25", color: "#10b981", sectionId: "desenvolvimento" },
    { id: 5, title: "Deploy Prod", subtitle: "AWS", startDate: "2025-12-05", endDate: "2025-12-08", color: "#ef4444", sectionId: "deploy" },
  ]);

  // Sensores DnD (Delay pequeno para evitar arrastar ao clicar apenas)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // --- LÓGICA DE DND ---

  // 1. HandleDragOver: Cuida de mover itens ENTRE listas (seções)
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Encontrar a tarefa que está sendo arrastada
    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // Cenário A: Arrastando sobre uma SEÇÃO (Header ou área vazia)
    const isOverSection = SECTIONS.some((s) => s.id === overId);
    if (isOverSection && activeTask.sectionId !== overId) {
      setTasks((prev) => {
        const activeIndex = prev.findIndex((t) => t.id === activeId);
        const newItems = [...prev];
        // Atualiza a seção da tarefa
        newItems[activeIndex] = { ...newItems[activeIndex], sectionId: String(overId) };
        return newItems;
      });
      return;
    }

    // Cenário B: Arrastando sobre outra TAREFA
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask && activeTask.sectionId !== overTask.sectionId) {
      setTasks((prev) => {
        const activeIndex = prev.findIndex((t) => t.id === activeId);
        const overIndex = prev.findIndex((t) => t.id === overId);
        
        const newItems = [...prev];
        // Adota a seção da tarefa sobre a qual estamos passando
        newItems[activeIndex] = { ...newItems[activeIndex], sectionId: overTask.sectionId };
        
        // Opcional: já realizar o move visualmente
        return arrayMove(newItems, activeIndex, overIndex);
      });
    }
  };

  // 2. HandleDragEnd: Cuida da reordenação final (Indices)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId !== overId) {
      setTasks((items) => {
        const oldIndex = items.findIndex((t) => t.id === activeId);
        const newIndex = items.findIndex((t) => t.id === overId);
        // Se newIndex for -1 (soltou na seção mas não em cima de tarefa), arrayMove trata ou ignoramos
        if (oldIndex !== -1 && newIndex !== -1) {
             return arrayMove(items, oldIndex, newIndex);
        }
        return items;
      });
    }
  };

  // --- POSICIONAMENTO E SCROLL ---
  const scrollRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current && scrollRef.current) {
        const daysUntilToday = getDaysDiff(timelineStartDate, now);
        const offset = daysUntilToday * CONFIG.dayWidth - 200; // 200px de margem
        scrollRef.current.scrollLeft = Math.max(offset, 0);
        initializedRef.current = true;
    }
  }, [now, timelineStartDate]);

  const getBarPosition = (startStr: string, endStr: string) => {
    const start = new Date(startStr + "T00:00:00");
    const end = new Date(endStr + "T00:00:00");
    const offsetDays = getDaysDiff(timelineStartDate, start);
    const durationDays = getDaysDiff(start, end) + 1;
    return { left: offsetDays * CONFIG.dayWidth, width: durationDays * CONFIG.dayWidth };
  };

  const todayOffset = useMemo(() => {
     const t = new Date(now); t.setHours(0,0,0,0);
     return getDaysDiff(timelineStartDate, t) * CONFIG.dayWidth;
  }, [now, timelineStartDate]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <GenericPanel sx={{ p: 0, overflow: "hidden", display: "flex", flexDirection: "column", height: "600px" }}>
        
        <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
          
          {/* ======================= SIDEBAR (ESQUERDA) ======================= */}
          <Box sx={{
            width: CONFIG.sidebarWidth,
            minWidth: CONFIG.sidebarWidth,
            borderRight: "1px solid #e0e0e0",
            backgroundColor: "#fff",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            boxShadow: "2px 0 5px rgba(0,0,0,0.05)"
          }}>
            <Box sx={{ height: CONFIG.headerHeight, borderBottom: "1px solid #e0e0e0", p: 2, display: "flex", alignItems: "center", flexShrink: 0 }}>
              <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: "bold" }}>Tarefas</Typography>
            </Box>

            <Box sx={{ overflowY: "auto", overflowX: "hidden", flex: 1 }}>
              {/* Iteramos sobre as SEÇÕES FIXAS */}
              {SECTIONS.map((section) => {
                // Filtramos as tarefas que pertencem a esta seção
                // Mantemos a ordem definida no array 'tasks' principal
                const sectionTasks = tasks.filter((t) => t.sectionId === section.id);
                
                return (
                  <SidebarSection
                    key={section.id}
                    section={section}
                    tasks={sectionTasks}
                  />
                );
              })}
            </Box>
          </Box>

          {/* ======================= TIMELINE (DIREITA) ======================= */}
          <Box
            ref={scrollRef}
            sx={{
              flex: 1,
              overflowX: "auto",
              overflowY: "hidden", // Sync com sidebar
              position: "relative",
              backgroundColor: "#f8fafc",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header Timeline */}
            <Box sx={{ display: "flex", height: CONFIG.headerHeight, borderBottom: "1px solid #e0e0e0", backgroundColor: "#fff", position: "sticky", top: 0, zIndex: 10, width: "max-content", flexShrink: 0 }}>
              {months.map((m, i) => (
                <Box key={i} sx={{ borderRight: "1px solid #e0e0e0" }}>
                  <Box sx={{ p: 1, fontSize: "0.8rem", fontWeight: "bold", textTransform: "uppercase", color: "#64748b" }}>
                    {monthNames[m.month]} {m.year}
                  </Box>
                  <Box sx={{ display: "flex", borderTop: "1px solid #f0f0f0" }}>
                    {m.days.map((d) => (
                      <Box key={d} sx={{ width: CONFIG.dayWidth, textAlign: "center", py: 1, fontSize: "0.75rem", color: "#94a3b8", borderRight: "1px solid #f8fafc" }}>
                        {d}
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Body Timeline */}
            <Box sx={{ position: "relative", width: "max-content", flex: 1 }}>
              
              {/* Linha Hoje */}
              <Box sx={{ position: "absolute", left: todayOffset + CONFIG.dayWidth / 2, top: 0, bottom: 0, width: 2, bgcolor: "#1e90ff", zIndex: 20, pointerEvents: "none" }}>
                <Box sx={{ position: "absolute", top: -10, left: -9 }}>
                     <GenericIcon icon="arrow_drop_down" sx={{ color: "#1e90ff" }} />
                </Box>
              </Box>

              {/* Grid Background */}
              <Box sx={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(to right, transparent ${CONFIG.dayWidth - 1}px, #e2e8f0 1px)`, backgroundSize: `${CONFIG.dayWidth}px 100%`, zIndex: 0 }} />

              {/* Renderização das Linhas (Sincronizada com SECTIONS) */}
              {SECTIONS.map((section) => {
                const sectionTasks = tasks.filter((t) => t.sectionId === section.id);

                return (
                  <React.Fragment key={section.id}>
                    {/* Barra da Seção (Timeline) */}
                    <Box
                      sx={{
                        height: CONFIG.sectionHeight,
                        bgcolor: "#f1f5f9",
                        borderBottom: "1px solid #e2e8f0",
                        width: "100%",
                        opacity: 0.5,
                        position: "relative",
                        zIndex: 1,
                      }}
                    />

                    {/* Barras das Tarefas */}
                    {sectionTasks.map((task) => {
                      const { left, width } = getBarPosition(task.startDate, task.endDate);
                      return (
                        <Box
                          key={task.id}
                          sx={{
                            height: CONFIG.rowHeight,
                            borderBottom: "1px solid #e2e8f0",
                            position: "relative",
                            width: "100%",
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              left,
                              width,
                              top: "50%",
                              transform: "translateY(-50%)",
                              height: 36,
                              bgcolor: task.color,
                              borderRadius: "6px",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                              color: "#fff",
                              fontSize: "0.75rem",
                              fontWeight: "bold",
                              display: "flex",
                              alignItems: "center",
                              px: 1,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              zIndex: 2,
                              mx: "2px",
                            }}
                          >
                            {task.title}
                          </Box>
                        </Box>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </Box>
          </Box>
        </Box>
      </GenericPanel>
    </DndContext>
  );
}