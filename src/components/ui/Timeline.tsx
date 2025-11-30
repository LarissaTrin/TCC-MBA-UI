import React, { useEffect, useRef, useState } from "react";
import { GenericIcon, GenericLoading, GenericPanel } from "../widgets";
import { Box } from "@mui/material";
import { GeneralColor } from "@/common/enum";

// Função para gerar os meses e dias
function generateTimeline(
  now = new Date(),
  monthsBefore = 2,
  monthsAfter = 12
) {
  const months = [];
  const start = new Date(now.getFullYear(), now.getMonth() - monthsBefore, 1);
  const iter = new Date(start);
  for (let i = 0; i < monthsBefore + monthsAfter + 1; i++) {
    const year = iter.getFullYear();
    const month = iter.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    months.push({
      year,
      month,
      days: Array.from({ length: days }, (_, i) => i + 1),
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

export function TimelineCalendar() {
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const months = generateTimeline(now, 2, 12);

  const todayIndex = months
    .flatMap((m, idx) => m.days.map((d, di) => ({ monthIdx: idx, day: d, di })))
    .findIndex(
      (item) =>
        months[item.monthIdx].year === now.getFullYear() &&
        months[item.monthIdx].month === now.getMonth() &&
        item.day === now.getDate()
    );

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (loading && el && todayIndex >= 0) {
      const itemWidth = 17 + 2 * 4;
      const scrollPos =
        todayIndex * itemWidth - el.clientWidth / 2 + itemWidth / 2;
      el.scrollLeft = Math.max(scrollPos, 0);
      setLoading(false);
    }
  }, [todayIndex, loading]);

  return (
    <GenericPanel
      sx={{
        overflowX: "auto",
        whiteSpace: "nowrap",
        width: "100%",
        minHeight: 300,
        maxHeight: "calc(100vh - 200px)",
        boxSizing: "border-box",
        paddingBottom: 1,
        paddingTop: 0,
        paddingLeft: 0,
        position: "relative", // importante para o ::after da linha
      }}
      ref={scrollRef}
    >
      {/* Linha vertical no dia atual - corta todo o painel */}
      {!loading && todayIndex >= 0 && (
        <>
          <Box
            sx={{
              position: "absolute",
              left: `${todayIndex * (17 + 8.56)}px`,
              top: 65,
              bottom: 0,
              width: 2,
              backgroundColor: "#1e90ff",
              zIndex: 10,
              boxShadow: "0 0 4px rgba(30, 144, 255, 0.5)",
            }}
          />
          {/* Setinha em cima da linha */}
          <Box
            sx={{
              position: "absolute",
              left: `${todayIndex * (17 + 8.56)}px`,
              top: 55,
              transform: "translateX(-50%)",
              zIndex: 20,
            }}
          >
            <GenericIcon
              icon="arrow_drop_down"
              size={24}
              sx={{ color: "#1e90ff" }}
            />
          </Box>
        </>
      )}

      <Box display="flex" flexDirection="column" height="100%">
        <Box display="flex" flexDirection="row">
          {months.map((m, mi) => (
            <Box key={mi} sx={{ display: "inline-block", border: "1px solid" }}>
              <Box sx={{ fontWeight: "bold", textAlign: "center" }}>
                {monthNames[m.month]} {m.year}
              </Box>
              <Box sx={{ display: "flex", gap: "10px", margin: "0 5px" }}>
                {m.days.map((day) => {
                  const isToday =
                    m.year === now.getFullYear() &&
                    m.month === now.getMonth() &&
                    day === now.getDate();
                  return (
                    <Box
                      key={day}
                      sx={{
                        lineHeight: "40px",
                        color: isToday ? "#1e90ff" : "#333",
                        textAlign: "center",
                        fontWeight: isToday ? "bold" : "normal",
                      }}
                    >
                      {day}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          {loading && <GenericLoading />}
        </Box>
      </Box>
    </GenericPanel>
  );
}
