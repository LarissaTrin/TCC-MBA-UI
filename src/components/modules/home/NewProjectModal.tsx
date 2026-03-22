import { useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Box,
} from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NewProjectFormData } from "@/common/schemas/projectSettingsSchema";
import { GenericButton, GenericTextField } from "@/components";
import { projectService } from "@/common/services";
import { ButtonVariant } from "@/common/enum";
import { useRouter } from "next/navigation";
import { useLoading } from "@/common/context/LoadingContext";
import { useTranslation } from "@/common/provider";

interface NewProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewProjectModal({ open, onClose }: NewProjectModalProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { withLoading } = useLoading();

  const newProjectSchema = useMemo(
    () => z.object({ projectName: z.string().min(3, t("newProject.nameMin")) }),
    [t],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<NewProjectFormData>({ resolver: zodResolver(newProjectSchema) });

  const handleClose = () => {
    reset({ projectName: "" });
    onClose();
  };

  const onSubmit: SubmitHandler<NewProjectFormData> = async (data) => {
    try {
      const newProject = await withLoading(() => projectService.create(data));
      handleClose();
      router.push(`/project/${newProject.id}`);
    } catch (error) {
      console.error("Failed to create project", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{t("newProject.title")}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <GenericTextField
              name="projectName"
              control={control}
              label={t("newProject.nameLabel")}
              autoFocus
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <GenericButton
            label={t("newProject.cancel")}
            onClick={handleClose}
            variant={ButtonVariant.Text}
          />
          <GenericButton
            label={isSubmitting ? t("newProject.creating") : t("newProject.create")}
            type="submit"
            disabled={isSubmitting}
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
}
