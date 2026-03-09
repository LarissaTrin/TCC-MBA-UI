"use client";

import { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenericButton, GenericTextField, GenericIcon } from "@/components/widgets";
import {
  newListSchema,
  NewListData,
} from "@/common/schemas/projectSettingsSchema";
import { ButtonVariant, GeneralSize } from "@/common/enum";
import { Section } from "@/common/model";
import { sectionService } from "@/common/services";

interface ProjectSettingsListsProps {
  projectId: number;
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;
  canDelete?: boolean;
}

export function ProjectSettingsLists({
  projectId,
  sections,
  onSectionsChange,
  canDelete = true,
}: ProjectSettingsListsProps) {
  const [lists, setLists] = useState<Section[]>(sections);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { control, handleSubmit, reset } = useForm<NewListData>({
    resolver: zodResolver(newListSchema),
    defaultValues: { name: "" },
  });

  const onCreateList = async (data: NewListData) => {
    setCreating(true);
    try {
      const newSection = await sectionService.create(projectId, {
        name: data.name,
        order: lists.length,
      });
      const updated = [...lists, newSection];
      setLists(updated);
      onSectionsChange(updated);
      reset({ name: "" });
    } finally {
      setCreating(false);
    }
  };

  const onDeleteList = async (sectionId: string) => {
    setDeletingId(sectionId);
    try {
      await sectionService.deleteSection(projectId, Number(sectionId));
      const updated = lists
        .filter((s) => s.id !== sectionId)
        .map((s, i) => ({ ...s, order: i }));
      setLists(updated);
      onSectionsChange(updated);
    } finally {
      setDeletingId(null);
    }
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

  const onSaveOrder = async () => {
    setSaving(true);
    try {
      await Promise.all(
        lists.map((section) =>
          sectionService.update(projectId, Number(section.id), {
            order: section.order,
          }),
        ),
      );
      onSectionsChange(lists);
    } finally {
      setSaving(false);
    }
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
          label={creating ? "Criando..." : "Criar"}
          type="submit"
          variant={ButtonVariant.Contained}
          size={GeneralSize.Small}
          disabled={creating}
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
                  disabled={index === 0 || deletingId === section.id}
                  onClick={() => onMoveList(index, "up")}
                  aria-label="mover para cima"
                >
                  <GenericIcon icon="arrow_upward" size={GeneralSize.Small} />
                </IconButton>
                <IconButton
                  size="small"
                  disabled={index === lists.length - 1 || deletingId === section.id}
                  onClick={() => onMoveList(index, "down")}
                  aria-label="mover para baixo"
                >
                  <GenericIcon icon="arrow_downward" size={GeneralSize.Small} />
                </IconButton>
                {canDelete && (
                  <IconButton
                    size="small"
                    disabled={deletingId === section.id}
                    onClick={() => onDeleteList(section.id)}
                    aria-label="excluir lista"
                  >
                    {deletingId === section.id ? (
                      <CircularProgress size={16} />
                    ) : (
                      <GenericIcon icon="delete" size={GeneralSize.Small} />
                    )}
                  </IconButton>
                )}
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

      {lists.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <GenericButton
            label={saving ? "Salvando..." : "Salvar ordem"}
            variant={ButtonVariant.Outlined}
            size={GeneralSize.Small}
            disabled={saving}
            onClick={onSaveOrder}
            startIcon={saving ? undefined : "save"}
          />
        </Box>
      )}
    </Box>
  );
}
