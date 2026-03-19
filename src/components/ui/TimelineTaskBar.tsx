// src/components/timeline/TimelineTaskBar.tsx
import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Task } from "../../common/model/timeline";
import { TIMELINE_CONFIG } from "../../common/constants/timeline";
import { getDaysDiff, addDays, formatDate } from "../../common/utils/timelineUtils";

interface TimelineTaskBarProps {
  task: Task;
  timelineStartDate: Date;
  onUpdate: (
    taskId: string | number,
    newStart: string,
    newEnd: string,
    newSectionId?: string,
    newIndex?: number
  ) => void;
  getDropLocationAtY: (y: number) => { sectionId: string; index: number } | null;
}

export function TimelineTaskBar({
  task,
  timelineStartDate,
  onUpdate,
  getDropLocationAtY,
}: TimelineTaskBarProps) {
  const [localStart, setLocalStart] = useState(task.startDate);
  const [localEnd, setLocalEnd] = useState(task.endDate);
  const [isDragging, setIsDragging] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const [hoverInfo, setHoverInfo] = useState<{ sectionId: string; index: number } | null>(null);

  useEffect(() => {
    setLocalStart(task.startDate);
    setLocalEnd(task.endDate);
    setTranslateY(0);
  }, [task.startDate, task.endDate, task.sectionId, task.index]);

  const start = new Date(localStart + "T00:00:00");
  const end = new Date(localEnd + "T00:00:00");
  const offsetDays = getDaysDiff(timelineStartDate, start);
  const durationDays = getDaysDiff(start, end) + 1;

  const left = offsetDays * TIMELINE_CONFIG.dayWidth;
  const width = durationDays * TIMELINE_CONFIG.dayWidth;

  const handleMouseDown = (e: React.MouseEvent, action: "move" | "resize-left" | "resize-right") => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialStart = new Date(localStart + "T00:00:00");
    const initialEnd = new Date(localEnd + "T00:00:00");

    // Mutable locals shared by onMouseMove and onMouseUp — avoids stale React state in the closure
    let currentStart = localStart;
    let currentEnd = localEnd;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const deltaDays = Math.round(deltaX / TIMELINE_CONFIG.dayWidth);

      if (action === "move") {
        const newStart = formatDate(addDays(initialStart, deltaDays));
        const newEnd = formatDate(addDays(initialEnd, deltaDays));
        currentStart = newStart;
        currentEnd = newEnd;
        setLocalStart(newStart);
        setLocalEnd(newEnd);
        setTranslateY(deltaY);
        setHoverInfo(getDropLocationAtY(moveEvent.clientY));
      } else if (action === "resize-right") {
        const newEnd = addDays(initialEnd, deltaDays);
        if (newEnd >= initialStart) {
          currentEnd = formatDate(newEnd);
          setLocalEnd(currentEnd);
        }
      } else if (action === "resize-left") {
        const newStart = addDays(initialStart, deltaDays);
        if (newStart <= initialEnd) {
          currentStart = formatDate(newStart);
          setLocalStart(currentStart);
        }
      }
    };

    const onMouseUp = (upEvent: MouseEvent) => {
      setIsDragging(false);
      setTranslateY(0);
      setHoverInfo(null);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      let targetSectionId = task.sectionId;
      let targetIndex = task.index;

      if (action === "move") {
        const location = getDropLocationAtY(upEvent.clientY);
        if (location) {
          targetSectionId = location.sectionId;
          targetIndex = location.index;
        }
      }
      // Use mutable locals — always have the final drag values
      onUpdate(task.id, currentStart, currentEnd, targetSectionId, targetIndex);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp, { once: true });
  };

  const ResizeHandle = ({ side }: { side: "left" | "right" }) => (
    <Box
      onMouseDown={(e) => handleMouseDown(e, `resize-${side}`)}
      sx={{
        width: 16, height: "100%", cursor: side === "left" ? "w-resize" : "e-resize",
        position: "absolute", [side]: 0, top: 0, zIndex: 3, display: "flex", alignItems: "center", justifyContent: "center",
        "&:hover .visual-bar": { opacity: 1, height: "60%", backgroundColor: "rgba(255,255,255,0.9)" }
      }}
    >
      <Box className="visual-bar" sx={{ width: 4, height: "40%", backgroundColor: "rgba(255,255,255,0.5)", borderRadius: "4px", transition: "all 0.2s ease" }} />
    </Box>
  );

  return (
    <Box
      sx={{
        position: "absolute", left, width, top: "50%",
        transform: `translate(0px, calc(-50% + ${translateY}px))`,
        height: 36, backgroundColor: task.color, borderRadius: "6px",
        boxShadow: isDragging ? "0 10px 20px rgba(0,0,0,0.3)" : "0 2px 4px rgba(0,0,0,0.1)",
        color: "#fff", fontSize: "0.75rem", fontWeight: "bold",
        display: "flex", alignItems: "center", zIndex: isDragging ? 9999 : 2,
        transition: isDragging ? "none" : "all 0.1s ease",
        userSelect: "none", cursor: "move", pl: 2, pr: 2,
        border: hoverInfo && (hoverInfo.sectionId !== task.sectionId || hoverInfo.index !== task.index) ? "2px solid white" : "none",
      }}
      onMouseDown={(e) => handleMouseDown(e, "move")}
    >
      <ResizeHandle side="left" />
      <Box sx={{ flex: 1, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", textAlign: "center" }}>
        {task.title}
        {isDragging && hoverInfo && (
           <Typography variant="caption" display="block" sx={{ fontSize: "0.6rem", opacity: 0.9 }}>
             {hoverInfo.sectionId.toUpperCase()} (Pos: {hoverInfo.index + 1})
           </Typography>
        )}
      </Box>
      <ResizeHandle side="right" />
    </Box>
  );
}