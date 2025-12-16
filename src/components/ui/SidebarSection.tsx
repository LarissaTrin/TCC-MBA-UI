// src/components/timeline/SidebarSection.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, Section } from "../../common/model";
import { TIMELINE_CONFIG } from "../../common/constants/timeline";

// --- Sub-componente: Item ---
function SortableSidebarItem({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  
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
        ref={setNodeRef} style={style} {...attributes} {...listeners} 
        sx={{ 
            height: TIMELINE_CONFIG.rowHeight, 
            borderBottom: "1px solid #f0f0f0", 
            display: "flex", flexDirection: "column", justifyContent: "center", px: 2, 
            cursor: "grab", "&:active": { cursor: "grabbing" }, touchAction: "none" 
        }}
    >
      <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>{task.title}</Typography>
      <Typography variant="caption" sx={{ color: "#64748b" }}>{task.subtitle}</Typography>
    </Box>
  );
}

// --- Componente: Seção ---
interface SidebarSectionProps {
    section: Section;
    tasks: Task[];
}

export function SidebarSection({ section, tasks }: SidebarSectionProps) {
  const { setNodeRef } = useDroppable({ id: section.id });
  
  return (
    <Box ref={setNodeRef} sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ height: TIMELINE_CONFIG.sectionHeight, backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", px: 2, borderBottom: "1px solid #e2e8f0" }}>
        <Typography variant="caption" sx={{ fontWeight: "bold", textTransform: "uppercase", color: "#475569" }}>
            {section.name}
        </Typography>
      </Box>
      <Box sx={{ minHeight: 0 }}>
        <SortableContext id={section.id} items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableSidebarItem key={task.id} task={task} />
          ))}
        </SortableContext>
      </Box>
    </Box>
  );
}