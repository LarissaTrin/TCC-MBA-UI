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
import {
  projectDetailsSchema,
  ProjectDetailsData,
} from "@/common/schemas/projectSettingsSchema";
import { ButtonVariant, GeneralSize, GeneralColor } from "@/common/enum";
import { projectService } from "@/common/services";

interface ProjectSettingsDetailsProps {
  projectId: number;
  projectTitle: string;
  projectDescription: string;
  onDeleteProject: () => void;
  canEdit: boolean;
}

export function ProjectSettingsDetails({
  projectId,
  projectTitle,
  projectDescription,
  onDeleteProject,
  canEdit,
}: ProjectSettingsDetailsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

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
    await projectService.update(projectId, {
      projectName: data.projectName,
      description: data.description,
    });
  };

  const handleDeleteClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    await projectService.delete(projectId);
    onDeleteProject();
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
            label="Nome do Projeto"
            size={GeneralSize.Small}
          />
          <GenericTextField
            name="description"
            control={control}
            label="Descrição"
            rows={4}
            size={GeneralSize.Small}
          />
        </Stack>

        {canEdit && (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <GenericButton
              label={isSubmitting ? "Salvando..." : "Salvar"}
              type="submit"
              variant={ButtonVariant.Contained}
              size={GeneralSize.Small}
              disabled={isSubmitting}
            />
          </Box>
        )}

        {canEdit && (
          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <GenericButton
              label="Excluir Projeto"
              variant={ButtonVariant.Outlined}
              color={GeneralColor.Error}
              size={GeneralSize.Small}
              startIcon="delete"
              onClick={handleDeleteClick}
            />
          </Box>
        )}
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Excluir Projeto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este projeto? Esta ação não pode ser
            desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <GenericButton
            label="Cancelar"
            variant={ButtonVariant.Text}
            onClick={() => setConfirmOpen(false)}
          />
          <GenericButton
            label="Excluir"
            variant={ButtonVariant.Contained}
            color={GeneralColor.Error}
            onClick={handleConfirmDelete}
          />
        </DialogActions>
      </Dialog>
    </>
  );
}
