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
import { GenericButton, GenericTextField } from "@/components";
import { projectService } from "@/common/services";
import { ButtonVariant } from "@/common/enum";
import { useRouter } from "next/navigation";
import { useLoading } from "@/common/context/LoadingContext";

const newProjectSchema = z.object({
  projectName: z
    .string()
    .min(3, "O nome do projeto deve ter no mínimo 3 caracteres."),
});
type NewProjectFormData = z.infer<typeof newProjectSchema>;

interface NewProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewProjectModal({ open, onClose }: NewProjectModalProps) {
  const router = useRouter();
  const { withLoading } = useLoading();

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
      console.error("Falha ao criar projeto", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Create a New Project</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <GenericTextField
              name="projectName"
              control={control}
              label="Project Name"
              autoFocus
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <GenericButton
            label="Cancel"
            onClick={handleClose}
            variant={ButtonVariant.Text}
          />
          <GenericButton
            label={isSubmitting ? "Creating..." : "Create Project"}
            type="submit"
            disabled={isSubmitting}
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
}
