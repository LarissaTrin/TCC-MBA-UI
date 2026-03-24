"use client";

import { useEffect, useState } from "react";
import { useFieldArray, UseFormReturn, useWatch, Control } from "react-hook-form";
import { CardFormData } from "@/common/schemas/cardSchema";
import { GeneralSize, ButtonVariant } from "@/common/enum";
import { GenericButton, GenericIcon } from "@/components/widgets";
import {
  Autocomplete,
  Box,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "@/common/provider";
import { useProjectMemberSearch } from "@/common/hooks";

// ─── Modal de edição/criação de task ─────────────────────────────────────────

interface TaskModalState {
  title: string;
  date: string;
  userId: string;
  userName: string;
}

interface TaskItemModalProps {
  open: boolean;
  initial: TaskModalState;
  projectId?: number;
  onClose: () => void;
  onSave: (data: TaskModalState) => void;
}

function TaskItemModal({ open, initial, projectId, onClose, onSave }: TaskItemModalProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initial.title);
  const [date, setDate] = useState(initial.date);
  const [userId, setUserId] = useState(initial.userId);
  const [userName, setUserName] = useState(initial.userName);

  const { options, loading, search, seedOption } = useProjectMemberSearch(projectId);

  useEffect(() => {
    if (open) {
      setTitle(initial.title);
      setDate(initial.date);
      setUserId(initial.userId);
      setUserName(initial.userName);
      if (initial.userId && initial.userName) {
        seedOption({ value: initial.userId, label: initial.userName });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim(), date, userId, userName });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth sx={{ zIndex: 2000 }}>
      <DialogTitle>{t("card.tasks.modalTitle")}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: "16px !important" }}>
        <TextField
          autoFocus
          label={t("card.tasks.titlePlaceholder")}
          fullWidth
          size="small"
          multiline
          rows={3}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Autocomplete
          size="small"
          options={options}
          value={options.find((o) => o.value === userId) ?? null}
          loading={loading}
          filterOptions={(x) => x}
          onInputChange={(_, value, reason) => {
            if (reason === "input") search(value);
          }}
          onChange={(_, newValue) => {
            setUserId(newValue?.value ?? "");
            setUserName(newValue?.label ?? "");
          }}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("card.tasks.assignedUser")}
              slotProps={{
                input: {
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={16} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                },
              }}
            />
          )}
          slotProps={{ popper: { sx: { zIndex: 3000 } } }}
        />
        <TextField
          label={t("card.tasks.date")}
          type="date"
          size="small"
          fullWidth
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <GenericButton
          label={t("common.cancel")}
          variant={ButtonVariant.Text}
          onClick={onClose}
        />
        <GenericButton
          label={t("common.save")}
          variant={ButtonVariant.Contained}
          onClick={handleSave}
          disabled={!title.trim()}
        />
      </DialogActions>
    </Dialog>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface CardTasksSectionProps {
  form: UseFormReturn<CardFormData>;
  projectId?: number;
}

export function CardTasksSection({ form, projectId }: CardTasksSectionProps) {
  const { t } = useTranslation();
  const { control, setValue } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "tasks" });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [modalInitial, setModalInitial] = useState<TaskModalState>({
    title: "",
    date: "",
    userId: "",
    userName: "",
  });

  const openNew = () => {
    setEditingIndex(null);
    setModalInitial({ title: "", date: "", userId: "", userName: "" });
    setModalOpen(true);
  };

  const openEdit = (index: number) => {
    const field = fields[index];
    setEditingIndex(index);
    setModalInitial({
      title: field.title ?? "",
      date: field.date ?? "",
      userId: field.userId ?? "",
      userName: field.userName ?? "",
    });
    setModalOpen(true);
  };

  const handleSave = (data: TaskModalState) => {
    if (editingIndex !== null) {
      setValue(`tasks.${editingIndex}.title`, data.title);
      setValue(`tasks.${editingIndex}.date`, data.date);
      setValue(`tasks.${editingIndex}.userId`, data.userId);
      setValue(`tasks.${editingIndex}.userName`, data.userName);
    } else {
      append({
        id: Date.now(),
        title: data.title,
        date: data.date,
        completed: false,
        userName: data.userName,
        userId: data.userId,
      });
    }
    setModalOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {t("card.tasks.title")}
        </Typography>
        <GenericButton
          label={t("card.tasks.add")}
          startIcon="add"
          size={GeneralSize.Small}
          variant={ButtonVariant.Outlined}
          onClick={openNew}
        />
      </Box>

      {fields.map((field, index) => (
        <TaskRow
          key={field.id}
          index={index}
          control={control}
          onEdit={() => openEdit(index)}
          onRemove={() => remove(index)}
          onToggle={(checked) => setValue(`tasks.${index}.completed`, checked)}
        />
      ))}

      {fields.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          {t("card.tasks.none")}
        </Typography>
      )}

      <TaskItemModal
        open={modalOpen}
        initial={modalInitial}
        projectId={projectId}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </Box>
  );
}

// ─── Row minimalista ──────────────────────────────────────────────────────────

interface TaskRowProps {
  index: number;
  control: Control<CardFormData>;
  onEdit: () => void;
  onRemove: () => void;
  onToggle: (checked: boolean) => void;
}

function TaskRow({ index, control, onEdit, onRemove, onToggle }: TaskRowProps) {
  const completed = useWatch({ control, name: `tasks.${index}.completed` });
  const title = useWatch({ control, name: `tasks.${index}.title` });

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        mb: 0.5,
        p: 0.5,
        borderRadius: 1,
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Checkbox
        checked={!!completed}
        onChange={(e) => onToggle(e.target.checked)}
        size="small"
        sx={{ p: 0.5 }}
      />
      <Typography
        variant="body2"
        noWrap
        sx={{
          flex: 1,
          minWidth: 0,
          cursor: "pointer",
          textDecoration: completed ? "line-through" : "none",
          color: completed ? "text.disabled" : "text.primary",
        }}
        onClick={onEdit}
      >
        {title || <span style={{ opacity: 0.4 }}>—</span>}
      </Typography>
      <IconButton size="small" onClick={onEdit} sx={{ opacity: 0.5, "&:hover": { opacity: 1 } }}>
        <GenericIcon icon="edit" size={GeneralSize.Small} />
      </IconButton>
      <IconButton size="small" color="error" onClick={onRemove} sx={{ opacity: 0.5, "&:hover": { opacity: 1 } }}>
        <GenericIcon icon="delete" size={GeneralSize.Small} />
      </IconButton>
    </Box>
  );
}
