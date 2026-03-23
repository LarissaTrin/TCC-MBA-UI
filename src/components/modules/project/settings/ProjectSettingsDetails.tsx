"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenericButton, GenericTextField } from "@/components/widgets";
import { useLoading } from "@/common/context/LoadingContext";
import {
  projectDetailsSchema,
  ProjectDetailsData,
} from "@/common/schemas/projectSettingsSchema";
import { ButtonVariant, GeneralSize, GeneralColor } from "@/common/enum";
import { projectService } from "@/common/services";
import { useTranslation } from "@/common/provider";

interface ProjectSettingsDetailsProps {
  projectId: number;
  projectTitle: string;
  projectDescription: string;
  onDeleteProject: () => void;
  canEdit: boolean;
  canDelete: boolean;
  onSaved?: (name: string, description: string) => void;
}

export function ProjectSettingsDetails({
  projectId,
  projectTitle,
  projectDescription,
  onDeleteProject,
  canEdit,
  canDelete,
  onSaved,
}: ProjectSettingsDetailsProps) {
  const { t } = useTranslation();
  const { withLoading } = useLoading();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ProjectDetailsData>({
    resolver: zodResolver(projectDetailsSchema),
    defaultValues: {
      projectName: projectTitle,
      description: projectDescription,
    },
  });

  useEffect(() => {
    reset({ projectName: projectTitle, description: projectDescription });
  }, [projectTitle, projectDescription, reset]);

  const onSave = async (data: ProjectDetailsData) => {
    await withLoading(() =>
      projectService.update(projectId, {
        projectName: data.projectName,
        description: data.description,
      }),
    );
    onSaved?.(data.projectName, data.description ?? "");
  };

  const handleDeleteClick = () => setConfirmOpen(true);

  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    setDeleting(true);
    try {
      await withLoading(() => projectService.delete(projectId));
      onDeleteProject();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSave)}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Stack spacing={2}>
          <GenericTextField
            name="projectName"
            control={control}
            label={t("settings.details.projectName")}
            size={GeneralSize.Small}
            disabled={!canEdit}
          />
          <GenericTextField
            name="description"
            control={control}
            label={t("settings.details.description")}
            rows={4}
            size={GeneralSize.Small}
            disabled={!canEdit}
          />
        </Stack>

        {canEdit && (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <GenericButton
              label={t("settings.details.save")}
              type="submit"
              variant={ButtonVariant.Contained}
              size={GeneralSize.Small}
              loading={isSubmitting}
            />
          </Box>
        )}

        {canDelete && (
          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <GenericButton
              label={t("settings.details.deleteProject")}
              variant={ButtonVariant.Contained}
              color={GeneralColor.Error}
              size={GeneralSize.Small}
              startIcon="delete"
              onClick={handleDeleteClick}
            />
          </Box>
        )}
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>{t("settings.details.confirmTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("settings.details.confirmText")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <GenericButton
            label={t("settings.details.cancel")}
            variant={ButtonVariant.Text}
            onClick={() => setConfirmOpen(false)}
          />
          <GenericButton
            label={t("settings.details.delete")}
            variant={ButtonVariant.Contained}
            color={GeneralColor.Error}
            loading={deleting}
            onClick={handleConfirmDelete}
          />
        </DialogActions>
      </Dialog>
    </>
  );
}
