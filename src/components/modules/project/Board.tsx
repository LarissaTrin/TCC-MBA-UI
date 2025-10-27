// Salve como: components/KanbanBoard.tsx
"use client";

import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay, // Para o "fantasma" do item
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Box } from '@mui/material';
import { createPortal } from 'react-dom';
import { Task, TaskProps } from '@/components/widgets/Task';
import { DroppableContainer } from '@/components/widgets/DroppableContainer';

// Tipo para o nosso estado
type KanbanContainers = Record<string, TaskProps[]>;

// Dados Iniciais
const initialData: KanbanContainers = {
  todo: [
    { id: '1', title: 'Tarefa 1' },
    { id: '2', title: 'Tarefa 2' },
    { id: '3', title: 'Tarefa 3' },
  ],
  inProgress: [
    { id: '4', title: 'Tarefa 4' },
    { id: '5', title: 'Tarefa 5' },
  ],
  done: [{ id: '6', title: 'Tarefa 6' }],
};

export function BoardContent() {
  const [containers, setContainers] = useState<KanbanContainers>(initialData);
  const [activeTask, setActiveTask] = useState<TaskProps | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Evita ativar o "arrastar" com cliques normais
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // --- Funções Auxiliares ---
  // Encontra em qual coluna uma tarefa está
  const findContainer = (id: string) => {
    if (id in containers) {
      return id; // É a própria coluna
    }
    return Object.keys(containers).find((key) =>
      containers[key].some((task) => task.id === id)
    );
  };

  // --- Lógica de Eventos ---
  const handleDragStart = (event: DragStartEvent) => {
    // Guarda a tarefa que está sendo arrastada
    const { active } = event;
    const sourceContainer = findContainer(active.id as string);
    if (sourceContainer) {
      const task = containers[sourceContainer].find((t) => t.id === active.id);
      setActiveTask(task || null);
    }
  };

  // Lógica principal: mover o item ENQUANTO arrasta (onDragOver)
  // Isso permite mover entre colunas antes de soltar
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return; // Só move se for para um container DIFERENTE
    }

    setContainers((prev) => {
      const sourceTasks = [...prev[activeContainer]];
      const destTasks = [...prev[overContainer]];

      // Encontra e remove a tarefa da coluna de origem
      const activeIndex = sourceTasks.findIndex((t) => t.id === activeId);
      const [movedTask] = sourceTasks.splice(activeIndex, 1);

      // Adiciona a tarefa na coluna de destino
      // (aqui, apenas adicionamos no final. 'overId' pode ser a coluna ou outro item)
      destTasks.push(movedTask);

      return {
        ...prev,
        [activeContainer]: sourceTasks,
        [overContainer]: destTasks,
      };
    });
  };

  // Lógica ao SOLTAR o item (onDragEnd)
  // Aqui nós finalizamos a reordenação
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      // A lógica de mover entre colunas já foi feita no 'handleDragOver'
      // Então, aqui só precisamos limpar o estado
      setActiveTask(null);
      return;
    }

    // Lógica para REORDENAR dentro da MESMA coluna
    const items = containers[activeContainer];
    const oldIndex = items.findIndex((t) => t.id === activeId);
    const newIndex = items.findIndex((t) => t.id === overId);

    if (oldIndex !== newIndex) {
      setContainers((prev) => ({
        ...prev,
        [activeContainer]: arrayMove(items, oldIndex, newIndex),
      }));
    }

    setActiveTask(null);
  };

  return (
    <Box sx={{ display: 'flex', gap: 3, p: 3 }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {Object.entries(containers).map(([id, tasks]) => (
          <DroppableContainer key={id} id={id} title={id.toUpperCase()} tasks={tasks} />
        ))}

        {/* O DragOverlay renderiza o "fantasma" do item */}
        {createPortal(
          <DragOverlay>
            {activeTask ? (
              <Task id={activeTask.id} title={activeTask.title} />
            ) : null}
          </DragOverlay>,
          document.body // Renderiza no <body> para evitar problemas de z-index
        )}
      </DndContext>
    </Box>
  );
}