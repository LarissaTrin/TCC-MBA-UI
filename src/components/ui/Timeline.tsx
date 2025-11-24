import React, { useEffect, useRef, useState } from "react";
import { GenericLoading, GenericPanel } from "../widgets";
import { Box } from "@mui/material";

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
      const itemWidth = 40 + 2 * 4;
      const scrollPos =
        todayIndex * itemWidth - el.clientWidth / 2 + itemWidth / 2;
      el.scrollLeft = Math.max(scrollPos, 0);
      setLoading(false);
    }
  }, [todayIndex]);

  return (
    <GenericPanel
      sx={{
        overflowX: "auto",
        whiteSpace: "nowrap",
        width: "100%",
        boxSizing: "border-box",
        paddingBottom: 1,
      }}
      ref={scrollRef}
    >
      <Box display="flex" flexDirection="column">
        <Box display="flex" flexDirection="row">
          {months.map((m, mi) => (
            <Box key={mi} sx={{ display: "inline-block", marginRight: 2 }}>
              <Box sx={{ fontWeight: "bold", textAlign: "center" }}>
                {monthNames[m.month]} {m.year}
              </Box>
              <Box sx={{ display: "flex" }}>
                {m.days.map((day) => {
                  const isToday =
                    m.year === now.getFullYear() &&
                    m.month === now.getMonth() &&
                    day === now.getDate();
                  return (
                    <Box
                      key={day}
                      sx={{
                        width: 40,
                        height: 40,
                        lineHeight: "40px",
                        margin: 0.5,
                        borderRadius: "50%",
                        backgroundColor: isToday ? "#1e90ff" : "#eee",
                        color: isToday ? "#fff" : "#333",
                        textAlign: "center",
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
            overflowX: "auto",
            whiteSpace: "nowrap",
            alignItems: "center",
            width: "100%",
            boxSizing: "border-box",
            paddingBottom: 1,
          }}
        >
          {loading && <GenericLoading />}
        </Box>
      </Box>
    </GenericPanel>
  );
}
