"use client";

import { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenericButton, GenericTextField, GenericIcon } from "@/components/widgets";
import { useLoading } from "@/common/context/LoadingContext";
import {
  newListSchema,
  NewListData,
} from "@/common/schemas/projectSettingsSchema";
import { ButtonVariant, GeneralSize, GeneralColor } from "@/common/enum";
import { Section } from "@/common/model";
import { sectionService } from "@/common/services";
import { useTranslation } from "@/common/provider";

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
  const { t } = useTranslation();
  const { withLoading } = useLoading();
  const [lists, setLists] = useState<Section[]>(sections);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>("");
  const [savingNameId, setSavingNameId] = useState<string | null>(null);

  // Confirmation dialog state
  const [pendingDelete, setPendingDelete] = useState<Section | null>(null);
  const [targetListId, setTargetListId] = useState<string>("");

  const { control, handleSubmit, reset } = useForm<NewListData>({
    resolver: zodResolver(newListSchema),
    defaultValues: { name: "" },
  });

  const onCreateList = async (data: NewListData) => {
    setCreating(true);
    try {
      const newSection = await withLoading(() =>
        sectionService.create(projectId, { name: data.name, order: lists.length }),
      );
      const updated = [...lists, newSection];
      setLists(updated);
      onSectionsChange(updated);
      reset({ name: "" });
    } finally {
      setCreating(false);
    }
  };

  const openDeleteConfirm = (section: Section) => {
    // Pre-select natural predecessor as default target
    const otherLists = lists.filter((s) => s.id !== section.id);
    const predecessor = [...otherLists]
      .filter((s) => s.order < section.order)
      .sort((a, b) => b.order - a.order)[0];
    setTargetListId(predecessor ? predecessor.id : (otherLists[0]?.id ?? ""));
    setPendingDelete(section);
  };

  const onDeleteList = async () => {
    if (!pendingDelete) return;
    const sectionId = pendingDelete.id;
    setDeleteError(null);
    setDeletingId(sectionId);
    setPendingDelete(null);
    try {
      const target = targetListId ? Number(targetListId) : undefined;
      await withLoading(() =>
        sectionService.deleteSection(projectId, Number(sectionId), target),
      );
      const updated = lists
        .filter((s) => s.id !== sectionId)
        .map((s, i) => ({ ...s, order: i }));
      setLists(updated);
      onSectionsChange(updated);
    } catch (err: unknown) {
      const apiErr = err as { body?: string; message?: string };
      try {
        const parsed = JSON.parse(apiErr.body ?? "{}");
        setDeleteError(parsed.detail ?? t("settings.lists.deleteError"));
      } catch {
        setDeleteError(apiErr.message ?? t("settings.lists.deleteError"));
      }
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

  const onStartEdit = (section: Section) => {
    setEditingId(section.id);
    setEditingName(section.name);
  };

  const onCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const onSaveName = async (sectionId: string) => {
    const trimmed = editingName.trim();
    if (!trimmed) return;
    setSavingNameId(sectionId);
    try {
      const updated = await withLoading(() =>
        sectionService.update(projectId, Number(sectionId), { name: trimmed }),
      );
      const updatedLists = lists.map((s) =>
        s.id === sectionId ? { ...s, name: updated.name } : s,
      );
      setLists(updatedLists);
      onSectionsChange(updatedLists);
    } finally {
      setEditingId(null);
      setEditingName("");
      setSavingNameId(null);
    }
  };

  const onSaveOrder = async () => {
    setSaving(true);
    try {
      await withLoading(() =>
        Promise.all(
          lists.map((section) =>
            sectionService.update(projectId, Number(section.id), {
              order: section.order,
            }),
          ),
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
        sx={{ display: "flex", gap: 1, alignItems: "flex-start", flexWrap: "wrap" }}
      >
        <Box sx={{ flex: 1, minWidth: 140 }}>
          <GenericTextField
            name="name"
            control={control}
            label={t("settings.lists.newListLabel")}
            size={GeneralSize.Small}
          />
        </Box>
        <GenericButton
          label={t("settings.lists.create")}
          type="submit"
          variant={ButtonVariant.Contained}
          size={GeneralSize.Small}
          loading={creating}
          sx={{ mt: "4px" }}
        />
      </Box>

      <List dense>
        {lists.map((section, index) => (
          <ListItem
            key={section.id}
            sx={{ paddingRight: "160px" }}
            secondaryAction={
              <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                {editingId === section.id ? (
                  <>
                    <IconButton
                      size="small"
                      color="success"
                      disabled={savingNameId === section.id}
                      onClick={() => onSaveName(section.id)}
                      aria-label={t("settings.lists.saveRename")}
                    >
                      {savingNameId === section.id ? (
                        <CircularProgress size={16} />
                      ) : (
                        <GenericIcon icon="check" size={GeneralSize.Small} />
                      )}
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={onCancelEdit}
                      aria-label={t("settings.lists.cancelRename")}
                    >
                      <GenericIcon icon="close" size={GeneralSize.Small} />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton
                      size="small"
                      disabled={deletingId === section.id}
                      onClick={() => onStartEdit(section)}
                      aria-label={t("settings.lists.rename")}
                    >
                      <GenericIcon icon="edit" size={GeneralSize.Small} />
                    </IconButton>
                    <IconButton
                      size="small"
                      disabled={index === 0 || deletingId === section.id}
                      onClick={() => onMoveList(index, "up")}
                      aria-label={t("settings.lists.moveUp")}
                    >
                      <GenericIcon icon="arrow_upward" size={GeneralSize.Small} />
                    </IconButton>
                    <IconButton
                      size="small"
                      disabled={index === lists.length - 1 || deletingId === section.id}
                      onClick={() => onMoveList(index, "down")}
                      aria-label={t("settings.lists.moveDown")}
                    >
                      <GenericIcon icon="arrow_downward" size={GeneralSize.Small} />
                    </IconButton>
                    {canDelete && (
                      <IconButton
                        size="small"
                        color="error"
                        disabled={deletingId === section.id}
                        onClick={() => openDeleteConfirm(section)}
                        aria-label={t("settings.lists.delete")}
                      >
                        {deletingId === section.id ? (
                          <CircularProgress size={16} />
                        ) : (
                          <GenericIcon icon="delete" size={GeneralSize.Small} />
                        )}
                      </IconButton>
                    )}
                  </>
                )}
              </Box>
            }
          >
            {editingId === section.id ? (
              <TextField
                size="small"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSaveName(section.id);
                  if (e.key === "Escape") onCancelEdit();
                }}
                autoFocus
                sx={{ mr: 1 }}
              />
            ) : (
              <ListItemText
                primary={section.name}
                secondary={index === lists.length - 1 ? t("settings.lists.finalList") : undefined}
                sx={{ minWidth: 0, "& .MuiListItemText-primary": { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }}
              />
            )}
          </ListItem>
        ))}
        {lists.length === 0 && (
          <ListItem>
            <ListItemText
              primary={t("settings.lists.noLists")}
              sx={{ color: "text.secondary" }}
            />
          </ListItem>
        )}
      </List>

      {deleteError && (
        <Typography variant="body2" color="error">
          {deleteError}
        </Typography>
      )}

      {lists.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <GenericButton
            label={t("settings.lists.saveOrder")}
            variant={ButtonVariant.Outlined}
            size={GeneralSize.Small}
            loading={saving}
            onClick={onSaveOrder}
            startIcon="save"
          />
        </Box>
      )}

      {/* Delete list confirmation dialog */}
      <Dialog open={Boolean(pendingDelete)} onClose={() => setPendingDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>
          {t("settings.lists.confirmDeleteTitle").replace("{name}", pendingDelete?.name ?? "")}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {lists.filter((s) => s.id !== pendingDelete?.id).length > 0 ? (
            <>
              <DialogContentText>
                {t("settings.lists.confirmDeleteText")}
              </DialogContentText>
              <FormControl size="small" fullWidth>
                <InputLabel>{t("settings.lists.moveCardsTo")}</InputLabel>
                <Select
                  value={targetListId}
                  label={t("settings.lists.moveCardsTo")}
                  onChange={(e) => setTargetListId(e.target.value)}
                >
                  {lists
                    .filter((s) => s.id !== pendingDelete?.id)
                    .map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {s.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </>
          ) : (
            <DialogContentText>
              {t("settings.lists.confirmDeleteNoCards")}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <GenericButton
            label={t("common.cancel")}
            variant={ButtonVariant.Text}
            onClick={() => setPendingDelete(null)}
          />
          <GenericButton
            label={t("settings.lists.confirmDelete")}
            variant={ButtonVariant.Contained}
            color={GeneralColor.Error}
            onClick={onDeleteList}
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
}
