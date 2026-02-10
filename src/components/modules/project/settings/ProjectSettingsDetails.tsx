"use client";

import { useState } from "react";
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

interface ProjectSettingsDetailsProps {
  onDeleteProject: () => void;
}

export function ProjectSettingsDetails({
  onDeleteProject,
}: ProjectSettingsDetailsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ProjectDetailsData>({
    resolver: zodResolver(projectDetailsSchema),
    defaultValues: {
      projectName: "",
      description: "",
    },
  });

  const onSave = (data: ProjectDetailsData) => {
    console.log("Saving project details:", data);
  };

  const handleDeleteClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setConfirmOpen(false);
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

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <GenericButton
            label={isSubmitting ? "Salvando..." : "Salvar"}
            type="submit"
            variant={ButtonVariant.Contained}
            size={GeneralSize.Small}
            disabled={isSubmitting}
          />
        </Box>

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
