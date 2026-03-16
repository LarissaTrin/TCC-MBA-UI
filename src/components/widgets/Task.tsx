"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GenericCard } from "./Card";

export interface TaskProps {
  id: string;
  title: string;
  order: number;
  onClick?: () => void;
}

export function Task({ id, title, onClick }: TaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1, // Não some 100%, fica fantasma para provar que a lista ainda o possui
    cursor: "grab",
    marginBottom: "10px",
  };

  return (
    <GenericCard
      title={title}
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      {...attributes}
      {...listeners}
    ></GenericCard>
  );
}

// Card visual isolado para o momento do clique+arraste
export function StaticTask({ title }: { title: string }) {
  return (
    <GenericCard
      title={title}
      style={{
        cursor: "grabbing",
        boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
        transform: "rotate(2deg)",
        backgroundColor: "#fff",
        marginBottom: "10px",
      }}
    ></GenericCard>
  );
}