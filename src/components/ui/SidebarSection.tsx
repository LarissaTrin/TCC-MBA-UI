// src/components/timeline/SidebarSection.tsx
import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, Section } from "../../common/model";
import { TIMELINE_CONFIG } from "../../common/constants/timeline";
import { useTranslation } from "@/common/provider";

function SortableSidebarItem({ task }: { task: Task }) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : "auto",
    position: "relative" as const,
  };

  const firstTag = task.tags?.[0];
  const extraTags = (task.tags?.length ?? 0) - 1;

  return (
    <Box
        ref={setNodeRef} style={style} {...attributes} {...listeners}
        sx={{
            height: TIMELINE_CONFIG.rowHeight,
            bgcolor: isDragging ? "action.selected" : "background.paper",
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex", flexDirection: "column", justifyContent: "center", px: 2,
            cursor: "grab", "&:active": { cursor: "grabbing" }, touchAction: "none"
        }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {task.title}
        </Typography>
        {task.blocked && (
          <Typography variant="caption" color="error" sx={{ fontWeight: 600, fontSize: "0.65rem", flexShrink: 0 }}>
            {t("card.blocked")}
          </Typography>
        )}
      </Box>
      {firstTag && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.25 }}>
          <Chip label={firstTag.name} size="small" sx={{ height: 16, fontSize: "0.65rem" }} />
          {extraTags > 0 && (
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: "0.65rem" }}>
              +{extraTags}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

interface SidebarSectionProps {
    section: Section;
    tasks: Task[];
}

export function SidebarSection({ section, tasks }: SidebarSectionProps) {
  const { setNodeRef } = useDroppable({ id: section.id });
  
  return (
    <Box ref={setNodeRef} sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ height: TIMELINE_CONFIG.sectionHeight, backgroundColor: "action.hover", display: "flex", alignItems: "center", px: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="caption" sx={{ fontWeight: "bold", textTransform: "uppercase", color: "text.secondary" }}>
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