import React, { useEffect, useRef, useState, useMemo } from "react";
import { GenericIcon, GenericLoading, GenericPanel } from "../widgets";
import { Box, Typography, Divider } from "@mui/material";

// --- CONFIGURAÇÕES VISUAIS ---
const CONFIG = {
  sidebarWidth: 260,
  dayWidth: 50,
  rowHeight: 60, // Altura da linha da tarefa
  sectionHeight: 40, // Altura do cabeçalho da seção
  headerHeight: 80,
};

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

const monthNames = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

// Helper corrigido com .getTime()
const getDaysDiff = (start: Date, end: Date) => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((end.getTime() - start.getTime()) / oneDay);
};

export function TimelineCalendar() {
  const [loading, setLoading] = useState(true);
  const now = useMemo(() => new Date(), []);
  const months = useMemo(() => generateTimeline(now, 1, 4), [now]);

  const timelineStartDate = useMemo(() => {
    return new Date(months[0].year, months[0].month, 1);
  }, [months]);

  // --- DADOS COM SEÇÕES ---
  const tasks = [
    // Seção: Planejamento
    {
      id: 1,
      title: "Definição de Escopo",
      subtitle: "Reunião com Stakeholders",
      startDate: "2025-11-28",
      endDate: "2025-12-02",
      color: "#3b82f6",
      section: "Planejamento",
    },
    {
      id: 2,
      title: "Aprovação de Orçamento",
      subtitle: "Financeiro",
      startDate: "2025-12-03",
      endDate: "2025-12-05",
      color: "#3b82f6",
      section: "Planejamento",
    },
    // Seção: Desenvolvimento
    {
      id: 3,
      title: "Desenvolvimento Backend",
      subtitle: "API e Banco de Dados",
      startDate: "2025-12-01",
      endDate: "2025-12-15",
      color: "#10b981",
      section: "Desenvolvimento",
    },
    {
      id: 4,
      title: "Frontend - Dashboard",
      subtitle: "React + Material UI",
      startDate: "2025-12-10",
      endDate: "2025-12-25",
      color: "#10b981",
      section: "Desenvolvimento",
    },
    // Seção: Deploy (O exemplo que você pediu)
    {
      id: 5,
      title: "Deploy Produção",
      subtitle: "Versão 2.0",
      startDate: "2025-12-05",
      endDate: "2025-12-08",
      color: "#ef4444",
      section: "Deploy / Go Live",
    },
  ];

  // --- AGRUPAR TAREFAS POR SEÇÃO ---
  const groupedTasks = useMemo(() => {
    return tasks.reduce((groups, task) => {
      const section = task.section || "Geral"; // Fallback se não tiver seção
      if (!groups[section]) {
        groups[section] = [];
      }
      groups[section].push(task);
      return groups;
    }, {} as Record<string, typeof tasks>);
  }, [tasks]);

  const sections = Object.keys(groupedTasks);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading && scrollRef.current) {
      const daysUntilToday = getDaysDiff(timelineStartDate, now);
      const scrollPos =
        daysUntilToday * CONFIG.dayWidth - scrollRef.current.clientWidth / 2;

      scrollRef.current.scrollLeft = Math.max(scrollPos, 0);
      setLoading(false);
    }
  }, [loading, now, timelineStartDate]);

  const getBarPosition = (startStr: string, endStr: string) => {
    const start = new Date(startStr + "T00:00:00");
    const end = new Date(endStr + "T00:00:00");
    const offsetDays = getDaysDiff(timelineStartDate, start);
    const durationDays = getDaysDiff(start, end) + 1;

    return {
      left: offsetDays * CONFIG.dayWidth,
      width: durationDays * CONFIG.dayWidth,
    };
  };

  // Posição da linha de "Hoje"
  const todayOffset = useMemo(() => {
    const todayAtMidnight = new Date(now);
    todayAtMidnight.setHours(0, 0, 0, 0);
    return getDaysDiff(timelineStartDate, todayAtMidnight) * CONFIG.dayWidth;
  }, [timelineStartDate, now]);

  return (
    <GenericPanel
      sx={{
        p: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "600px",
      }}
    >
      {/* Container Principal */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* ======================= SIDEBAR (ESQUERDA) ======================= */}
        <Box
          sx={{
            width: CONFIG.sidebarWidth,
            minWidth: CONFIG.sidebarWidth,
            borderRight: "1px solid #e0e0e0",
            backgroundColor: "#fff",
            zIndex: 2,
            boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header Sidebar */}
          <Box
            sx={{
              height: CONFIG.headerHeight,
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
              Tarefas / Projetos
            </Typography>
          </Box>

          {/* Lista Scrollável (Sincronizada verticalmente com a direita) */}
          <Box sx={{ overflow: "hidden" }}>
            {sections.map((section) => (
              <React.Fragment key={section}>
                {/* Cabeçalho da Seção na Sidebar */}
                <Box
                  sx={{
                    height: CONFIG.sectionHeight,
                    backgroundColor: "#f1f5f9", // Cinza claro
                    display: "flex",
                    alignItems: "center",
                    px: 2,
                    borderBottom: "1px solid #e2e8f0",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      color: "#475569",
                    }}
                  >
                    {section}
                  </Typography>
                </Box>

                {/* Itens da Seção */}
                {groupedTasks[section].map((task) => (
                  <Box
                    key={task.id}
                    sx={{
                      height: CONFIG.rowHeight,
                      borderBottom: "1px solid #f0f0f0",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      px: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: "#334155" }}
                    >
                      {task.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      {task.subtitle}
                    </Typography>
                  </Box>
                ))}
              </React.Fragment>
            ))}
          </Box>
        </Box>

        {/* ======================= TIMELINE (DIREITA) ======================= */}
        <Box
          ref={scrollRef}
          sx={{
            flex: 1,
            overflowX: "auto",
            overflowY: "hidden", // Scroll Y oculto, o pai controla se precisar, ou scrolla o container todo
            position: "relative",
            backgroundColor: "#f8fafc",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header Dias/Meses */}
          <Box
            sx={{
              display: "flex",
              height: CONFIG.headerHeight,
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
                  {monthNames[m.month]} {m.year}
                </Box>
                <Box sx={{ display: "flex", borderTop: "1px solid #f0f0f0" }}>
                  {m.days.map((d) => {
                    const isToday =
                      m.year === now.getFullYear() &&
                      m.month === now.getMonth() &&
                      d === now.getDate();
                    return (
                      <Box
                        key={d}
                        sx={{
                          width: CONFIG.dayWidth,
                          textAlign: "center",
                          py: 1,
                          fontSize: "0.75rem",
                          color: isToday ? "#1e90ff" : "#94a3b8",
                          fontWeight: isToday ? "bold" : "normal",
                          borderRight: "1px solid #f8fafc",
                        }}
                      >
                        {d}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Corpo (Grid + Itens) */}
          <Box sx={{ position: "relative", width: "max-content" }}>
            {/* Linha Vertical "HOJE" */}
            <Box
              sx={{
                position: "absolute",
                left: todayOffset + CONFIG.dayWidth / 2,
                top: 0,
                bottom: 0,
                width: "2px",
                backgroundColor: "#1e90ff",
                zIndex: 20,
                pointerEvents: "none",
              }}
            >
              <Box sx={{ position: "absolute", top: -10, left: -9 }}>
                <GenericIcon icon="arrow_drop_down" sx={{ color: "#1e90ff" }} />
              </Box>
            </Box>

            {/* Fundo Listrado (Grid) */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage: `linear-gradient(to right, transparent ${
                  CONFIG.dayWidth - 1
                }px, #e2e8f0 1px)`,
                backgroundSize: `${CONFIG.dayWidth}px 100%`,
                zIndex: 0,
              }}
            />

            {/* RENDERIZAÇÃO DAS SEÇÕES E TAREFAS NA TIMELINE */}
            {sections.map((section) => (
              <React.Fragment key={section}>
                {/* Linha da Seção na Timeline (Background cinza que atravessa a grade) */}
                <Box
                  sx={{
                    height: CONFIG.sectionHeight,
                    backgroundColor: "#f1f5f9", // Mesmo cinza da sidebar
                    opacity: 0.5, // Leve transparência para ver um pouco a grid se quiser
                    borderBottom: "1px solid #e2e8f0",
                    width: "100%",
                    zIndex: 1,
                    position: "relative",
                  }}
                />

                {/* Linhas das Tarefas */}
                {groupedTasks[section].map((task) => {
                  const { left, width } = getBarPosition(
                    task.startDate,
                    task.endDate
                  );
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
                          left: left,
                          width: width,
                          top: "50%",
                          transform: "translateY(-50%)",
                          height: 36,
                          backgroundColor: task.color,
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
            ))}
          </Box>
        </Box>
      </Box>
    </GenericPanel>
  );
}
