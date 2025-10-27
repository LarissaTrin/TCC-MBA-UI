// Salve como: components/Column.tsx
"use client";

import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, Paper, Typography } from '@mui/material';
import { Task, TaskProps } from './Task'; // Importamos o Task

interface ColumnProps {
  id: string; // ID da coluna (ex: "todo")
  title: string;
  tasks: TaskProps[]; // Array de tarefas
}

export function DroppableContainer({ id, title, tasks }: ColumnProps) {
  // Pega apenas os IDs para o SortableContext
  const taskIds = tasks.map((task) => task.id);

  return (
    <Paper
      sx={{
        width: 300,
        minHeight: 400,
        backgroundColor: '#f4f5f7',
        padding: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      {/* Este contexto "sabe" como ordenar os itens filhos */}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <Box>
          {tasks.map((task) => (
            <Task key={task.id} id={task.id} title={task.title} />
          ))}
        </Box>
      </SortableContext>
    </Paper>
  );
}