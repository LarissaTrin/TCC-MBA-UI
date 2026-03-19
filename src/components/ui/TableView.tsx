"use client";
import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
} from "@mui/material";
import { TaskProps } from "../widgets/Task";
import { Section } from "@/common/model";
import { cardService } from "@/common/services";
import { useTranslation } from "@/common/provider";

interface TableViewProps {
  containers: Record<string, TaskProps[]>;
  setContainers: React.Dispatch<
    React.SetStateAction<Record<string, TaskProps[]>>
  >;
  sections: Section[];
}

export function TableView({ containers, setContainers, sections }: TableViewProps) {
  const { t } = useTranslation();

  // Build a map of sectionId → { order, name } for sorting and display
  const sectionMeta = React.useMemo(() => {
    const map: Record<string, { order: number; name: string }> = {};
    sections.forEach((s) => {
      map[s.id] = { order: s.order, name: s.name };
    });
    return map;
  }, [sections]);

  const allTasks = React.useMemo(() => {
    return Object.entries(containers)
      .flatMap(([column, tasks]) =>
        tasks.filter(Boolean).map((task, index) => ({
          ...task,
          column,
          order: task.index ?? index,
        }))
      )
      .sort((a, b) => {
        // 1. Sort by list order
        const listOrderA = sectionMeta[a.column]?.order ?? 0;
        const listOrderB = sectionMeta[b.column]?.order ?? 0;
        if (listOrderA !== listOrderB) return listOrderA - listOrderB;

        // 2. Sort by priority ascending (lower = higher priority; undefined goes last)
        const prioA = a.priority ?? Number.MAX_SAFE_INTEGER;
        const prioB = b.priority ?? Number.MAX_SAFE_INTEGER;
        if (prioA !== prioB) return prioA - prioB;

        // 3. Sort by position within list
        return a.order - b.order;
      });
  }, [containers, sectionMeta]);

  const sensors = useSensors(useSensor(PointerSensor));

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = allTasks.findIndex((t) => t.id === active.id);
    const newIndex = allTasks.findIndex((t) => t.id === over.id);

    const reordered = arrayMove(allTasks, oldIndex, newIndex).map((t, idx) => ({
      ...t,
      order: idx + 1,
    }));

    const updatedContainers: Record<string, TaskProps[]> = {};
    Object.keys(containers).forEach((key) => {
      updatedContainers[key] = reordered
        .filter((t) => containers[key].some((ct) => ct?.id === t?.id))
        .map(({ column, ...rest }) => rest);
    });

    setContainers(updatedContainers);

    const movedTask = reordered.find((t) => t.id === active.id);
    if (movedTask) {
      try {
        await cardService.update(Number(movedTask.id), {
          listId: Number(movedTask.column),
          sortIndex: movedTask.order,
        });
      } catch (error) {
        console.error("Erro na atualização da API:", error);
      }
    }
  }

  return (
    <Paper sx={{ p: 2 }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={allTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 60 }}>{t("table.order")}</TableCell>
                <TableCell>{t("table.title")}</TableCell>
                <TableCell>{t("table.list")}</TableCell>
                <TableCell sx={{ width: 100 }}>{t("table.priority")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allTasks.map((task, globalIndex) => (
                <SortableRow
                  key={task.id}
                  task={task}
                  globalIndex={globalIndex + 1}
                  sectionName={sectionMeta[task.column]?.name ?? task.column}
                  priorityLabel={
                    task.priority != null ? String(task.priority) : t("table.noPriority")
                  }
                />
              ))}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>
    </Paper>
  );
}

function SortableRow({
  task,
  globalIndex,
  sectionName,
  priorityLabel,
}: {
  task: TaskProps & { column: string; order: number };
  globalIndex: number;
  sectionName: string;
  priorityLabel: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    backgroundColor: isDragging ? "#f0f8ff" : "inherit",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TableCell>{globalIndex}</TableCell>
      <TableCell>
        <Typography noWrap>{task.title}</Typography>
      </TableCell>
      <TableCell>{sectionName}</TableCell>
      <TableCell>{priorityLabel}</TableCell>
    </TableRow>
  );
}
