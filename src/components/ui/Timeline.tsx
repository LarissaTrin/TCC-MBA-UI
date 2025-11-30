import React, { useEffect, useRef, useState, useMemo } from "react";
import { GenericIcon, GenericLoading, GenericPanel } from "../widgets";
import { Box, Typography, Divider } from "@mui/material";

// --- CONFIGURAÇÕES VISUAIS ---
const CONFIG = {
  sidebarWidth: 260, // Largura da lista de tarefas
  dayWidth: 50, // Largura de cada dia na timeline
  rowHeight: 60, // Altura de cada linha (tarefa)
  headerHeight: 80, // Altura do cabeçalho (Meses + Dias)
};

// --- HELPERS DE DATA ---
function generateTimeline(now = new Date(), monthsBefore = 1, monthsAfter = 3) {
  const months = [];
  const start = new Date(now.getFullYear(), now.getMonth() - monthsBefore, 1);
  const iter = new Date(start);

  // Ajuste para garantir que percorremos os meses corretamente
  for (let i = 0; i < monthsBefore + monthsAfter + 1; i++) {
    const year = iter.getFullYear();
    const month = iter.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    months.push({
      year,
      month, // 0-11
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

// Helper para calcular dias entre duas datas
const getDaysDiff = (start: Date, end: Date) => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((end.getTime() - start.getTime()) / oneDay);
};

export function TimelineCalendar() {
  const [loading, setLoading] = useState(true);
  const now = useMemo(() => new Date(), []);

  // Gera a timeline
  const months = useMemo(() => generateTimeline(now, 1, 4), [now]);

  // Data inicial absoluta da timeline (dia 1 do primeiro mês gerado)
  const timelineStartDate = useMemo(() => {
    return new Date(months[0].year, months[0].month, 1);
  }, [months]);

  // Seus dados (Adicionei title para a sidebar)
  const tasks = [
    {
      id: 1,
      title: "Viagem da Empresa",
      subtitle: "Planejamento anual",
      startDate: "2025-11-28",
      endDate: "2025-12-04",
      color: "#3b82f6", // Azul
    },
    {
      id: 2,
      title: "Campanha de Natal",
      subtitle: "Marketing Digital",
      startDate: "2025-12-01",
      endDate: "2025-12-20",
      color: "#10b981", // Verde
    },
    {
      id: 3,
      title: "Deploy Produção",
      subtitle: "Versão 2.0",
      startDate: "2025-12-05",
      endDate: "2025-12-08",
      color: "#ef4444", // Vermelho
    },
    {
      id: 4,
      title: "Reunião de Feedback",
      subtitle: "Equipe Tech",
      startDate: "2025-12-10",
      endDate: "2025-12-10",
      color: "#f59e0b", // Laranja
    },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);

  // --- EFEITO DE SCROLL INICIAL ---
  useEffect(() => {
    if (loading && scrollRef.current) {
      // Calcular quantos dias existem entre o inicio da timeline e hoje
      const daysUntilToday = getDaysDiff(timelineStartDate, now);

      // Centralizar scroll
      const scrollPos =
        daysUntilToday * CONFIG.dayWidth - scrollRef.current.clientWidth / 2;

      scrollRef.current.scrollLeft = Math.max(scrollPos, 0);
      setLoading(false);
    }
  }, [loading, now, timelineStartDate]);

  // Calcula a posição (left) e largura (width) de uma barra
  const getBarPosition = (startStr: string, endStr: string) => {
    const start = new Date(startStr + "T00:00:00"); // Forçar hora zero para evitar fuso
    const end = new Date(endStr + "T00:00:00");

    // Dias desde o início da timeline até o início da tarefa
    const offsetDays = getDaysDiff(timelineStartDate, start);

    // Duração da tarefa em dias (+1 para incluir o dia final)
    const durationDays = getDaysDiff(start, end) + 1;

    return {
      left: offsetDays * CONFIG.dayWidth,
      width: durationDays * CONFIG.dayWidth,
    };
  };

  // Posição da linha de "Hoje"
  const todayOffset = getDaysDiff(timelineStartDate, now) * CONFIG.dayWidth;

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
      {/* Container Principal Flex: Esquerda (Fixa) | Direita (Scroll) */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* --- SIDEBAR (Esquerda) --- */}
        <Box
          sx={{
            width: CONFIG.sidebarWidth,
            minWidth: CONFIG.sidebarWidth,
            borderRight: "1px solid #e0e0e0",
            backgroundColor: "#fff",
            zIndex: 2,
            boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
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
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontSize: "1rem", fontWeight: "bold" }}
            >
              Tarefas / Projetos
            </Typography>
          </Box>

          {/* Lista de Tarefas (Sidebar) */}
          <Box sx={{ overflowY: "hidden" }}>
            {" "}
            {/* O scroll Y será controlado pelo pai se necessário */}
            {tasks.map((task) => (
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
          </Box>
        </Box>

        {/* --- TIMELINE AREA (Direita) --- */}
        <Box
          ref={scrollRef}
          sx={{
            flex: 1,
            overflowX: "auto",
            overflowY: "hidden",
            position: "relative",
            backgroundColor: "#f8fafc", // Fundo leve
          }}
        >
          {/* Header da Timeline (Meses e Dias) */}
          <Box
            sx={{
              display: "flex",
              height: CONFIG.headerHeight,
              borderBottom: "1px solid #e0e0e0",
              backgroundColor: "#fff",
              position: "sticky",
              top: 0,
              zIndex: 10,
              width: "max-content", // Garante que o header cresça com o conteúdo
            }}
          >
            {months.map((m, i) => (
              <Box key={i} sx={{ borderRight: "1px solid #e0e0e0" }}>
                {/* Mês */}
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
                {/* Dias */}
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

          {/* Corpo da Timeline (Grid + Barras) */}
          <Box sx={{ position: "relative", width: "max-content" }}>
            {/* Linha do "HOJE" (Corta de cima a baixo) */}
            <Box
              sx={{
                position: "absolute",
                left: todayOffset + CONFIG.dayWidth / 2, // Centraliza no meio da coluna do dia
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

            {/* Grid de Fundo (Listras Verticais) */}
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

            {/* Renderização das Linhas de Tarefa */}
            {tasks.map((task) => {
              const { left, width } = getBarPosition(
                task.startDate,
                task.endDate
              );

              return (
                <Box
                  key={task.id}
                  sx={{
                    height: CONFIG.rowHeight,
                    borderBottom: "1px solid #e2e8f0", // Linha horizontal separadora
                    position: "relative",
                    width: "100%", // Ocupa a largura total calculada
                  }}
                >
                  {/* A Barra da Tarefa */}
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
                      mx: "2px", // Margemzinha para não colar na linha da grade
                    }}
                  >
                    {task.title}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </GenericPanel>
  );
}
