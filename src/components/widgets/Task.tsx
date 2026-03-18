"use client";

import React from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import { GenericCard } from "./Card";

export interface TaskProps {
  id: string;
  title: string;
  columnId: string;
  index: number;
  onClick?: () => void;
}

export function Task({ id, title, columnId, index, onClick }: TaskProps) {
  const { ref, isDragging } = useSortable({
    id,
    index,
    group: columnId,
    type: "item",
    accept: ["item"],
  });

  const style = {
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
    marginBottom: "10px",
  };

  return (
    <div ref={ref} style={style}>
      <GenericCard title={title} onClick={onClick} />
    </div>
  );
}

// Card estático para o overlay (opcional com @dnd-kit/react)
export function StaticTask({ title }: { title: string }) {
  return (
    <GenericCard
      title={title}
      style={{
        cursor: "grabbing",
        boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
        backgroundColor: "#fff",
      }}
    />
  );
}