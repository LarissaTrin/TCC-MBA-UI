// Salve como: components/Task.tsx
"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, Typography } from '@mui/material';

export interface TaskProps {
  id: string; // ID da tarefa
  title: string; // Título da tarefa
}

export function Task({ id, title }: TaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging, // Útil para estilização
  } = useSortable({ id }); // O hook principal

  // Estilos para o dnd-kit controlar a posição
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    cursor: 'grab',
    marginBottom: '10px',
  };

  return (
    <Card
      ref={setNodeRef} // Conecta o dnd-kit ao elemento
      style={style}
      {...attributes} // Permite o dnd-kit controlar
      {...listeners} // Adiciona os eventos de mouse/toque
    >
      <CardContent>
        <Typography>{title}</Typography>
      </CardContent>
    </Card>
  );
}