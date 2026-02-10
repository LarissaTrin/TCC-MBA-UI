"use client";

import { useState } from "react";
import { Box, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenericButton, GenericTextField, GenericIcon } from "@/components/widgets";
import {
  newListSchema,
  NewListData,
} from "@/common/schemas/projectSettingsSchema";
import { ButtonVariant, GeneralSize } from "@/common/enum";
import { Section } from "@/common/model";

interface ProjectSettingsListsProps {
  sections: Section[];
}

export function ProjectSettingsLists({ sections }: ProjectSettingsListsProps) {
  const [lists, setLists] = useState<Section[]>(sections);

  const { control, handleSubmit, reset } = useForm<NewListData>({
    resolver: zodResolver(newListSchema),
    defaultValues: { name: "" },
  });

  const onCreateList = (data: NewListData) => {
    const newSection: Section = {
      id: `list-${Date.now()}`,
      name: data.name,
      order: lists.length,
    };
    setLists((prev) => [...prev, newSection]);
    reset({ name: "" });
  };

  const onDeleteList = (sectionId: string) => {
    setLists((prev) => prev.filter((s) => s.id !== sectionId));
  };

  const onMoveList = (index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= lists.length) return;

    setLists((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[swapIndex];
      updated[swapIndex] = temp;
      return updated.map((item, i) => ({ ...item, order: i }));
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        component="form"
        onSubmit={handleSubmit(onCreateList)}
        sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}
      >
        <GenericTextField
          name="name"
          control={control}
          label="Nome da nova lista"
          size={GeneralSize.Small}
        />
        <GenericButton
          label="Criar"
          type="submit"
          variant={ButtonVariant.Contained}
          size={GeneralSize.Small}
          sx={{ mt: "4px" }}
        />
      </Box>

      <List dense>
        {lists.map((section, index) => (
          <ListItem
            key={section.id}
            secondaryAction={
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <IconButton
                  size="small"
                  disabled={index === 0}
                  onClick={() => onMoveList(index, "up")}
                  aria-label="mover para cima"
                >
                  <GenericIcon icon="arrow_upward" size={GeneralSize.Small} />
                </IconButton>
                <IconButton
                  size="small"
                  disabled={index === lists.length - 1}
                  onClick={() => onMoveList(index, "down")}
                  aria-label="mover para baixo"
                >
                  <GenericIcon icon="arrow_downward" size={GeneralSize.Small} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onDeleteList(section.id)}
                  aria-label="excluir lista"
                >
                  <GenericIcon icon="delete" size={GeneralSize.Small} />
                </IconButton>
              </Box>
            }
          >
            <ListItemText
              primary={section.name}
              secondary={section.isFinal ? "Lista final" : undefined}
            />
          </ListItem>
        ))}
        {lists.length === 0 && (
          <ListItem>
            <ListItemText
              primary="Nenhuma lista criada."
              sx={{ color: "text.secondary" }}
            />
          </ListItem>
        )}
      </List>
    </Box>
  );
}
