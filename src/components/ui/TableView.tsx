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
  Box,
  Typography,
} from "@mui/material";
import { TaskProps } from "../widgets/Task";
import { cardService } from "@/common/services";

interface TableViewProps {
  containers: Record<string, TaskProps[]>;
  setContainers: React.Dispatch<
    React.SetStateAction<Record<string, TaskProps[]>>
  >;
}

export function TableView({ containers, setContainers }: TableViewProps) {
  const allTasks = Object.entries(containers)
    .flatMap(([column, tasks]) =>
      tasks.filter(Boolean).map((task, index) => ({
        ...task,
        column,
        order: task.order ?? index + 1,
      }))
    )
    .sort((a, b) => a.order - b.order);

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

    // --- MANDA PARA A API ---
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
                <TableCell>Ordem</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Container</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allTasks.map((task) => (
                <SortableRow key={task.id} task={task} />
              ))}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>
    </Paper>
  );
}

function SortableRow({ task }: { task: TaskProps & { column: string } }) {
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
      <TableCell>{task.order}</TableCell>
      <TableCell>
        <Typography noWrap>{task.title}</Typography>
      </TableCell>
      <TableCell>{task.column}</TableCell>
    </TableRow>
  );
}