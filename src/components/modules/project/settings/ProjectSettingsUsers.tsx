"use client";

import { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  CircularProgress,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenericButton, GenericTextField, GenericIcon } from "@/components/widgets";
import { addUserSchema, AddUserData } from "@/common/schemas/projectSettingsSchema";
import { ButtonVariant, GeneralSize } from "@/common/enum";
import { InviteUserResult, ProjectMember } from "@/common/model";
import { projectService } from "@/common/services";

interface StagingEntry {
  email: string;
  role: string;
}

interface ProjectSettingsUsersProps {
  projectId: number;
  currentMembers: ProjectMember[];
  onMembersUpdate: (members: ProjectMember[]) => void;
}

const ROLE_LABELS: Record<string, string> = {
  User: "Usuário",
  Leader: "Líder",
  Admin: "Admin",
};

const INVITABLE_ROLES = ["User", "Leader", "Admin"];

export function ProjectSettingsUsers({
  projectId,
  currentMembers,
  onMembersUpdate,
}: ProjectSettingsUsersProps) {
  const [stagingList, setStagingList] = useState<StagingEntry[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("User");
  const [inviteResults, setInviteResults] = useState<InviteUserResult[]>([]);
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [stagingError, setStagingError] = useState<string | null>(null);

  const { control, handleSubmit, reset } = useForm<AddUserData>({
    resolver: zodResolver(addUserSchema),
    defaultValues: { email: "" },
  });

  const onAddToStaging = (data: AddUserData) => {
    const email = data.email.trim().toLowerCase();
    setStagingError(null);
    const alreadyMember = currentMembers.some(
      (m) => m.user.email.toLowerCase() === email,
    );
    if (alreadyMember) {
      setStagingError("Este usuário já é membro do projeto.");
      return;
    }
    if (!stagingList.some((s) => s.email === email)) {
      setStagingList((prev) => [...prev, { email, role: selectedRole }]);
    }
    reset({ email: "" });
  };

  const onRemoveFromStaging = (email: string) => {
    setStagingList((prev) => prev.filter((s) => s.email !== email));
    setInviteResults((prev) => prev.filter((r) => r.email !== email));
  };

  const onChangeRoleInStaging = (email: string, role: string) => {
    setStagingList((prev) =>
      prev.map((s) => (s.email === email ? { ...s, role } : s)),
    );
  };

  const onSendInvites = async () => {
    if (stagingList.length === 0) return;
    setSaving(true);
    setInviteResults([]);
    try {
      const response = await projectService.inviteUsers(
        projectId,
        stagingList.map((s) => ({ email: s.email, role: s.role })),
      );
      setInviteResults(response.results);

      const newlyAdded = response.results.filter(
        (r) => r.registered && !r.alreadyMember,
      );
      if (newlyAdded.length > 0) {
        const detail = await projectService.getDetailById(projectId);
        if (detail) onMembersUpdate(detail.projectUsers);
        setStagingList((prev) =>
          prev.filter((s) => !newlyAdded.some((r) => r.email === s.email)),
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const onRemoveMember = async (member: ProjectMember) => {
    setRemovingId(member.userId);
    try {
      await projectService.removeMember(projectId, member.userId);
      onMembersUpdate(currentMembers.filter((m) => m.userId !== member.userId));
    } finally {
      setRemovingId(null);
    }
  };

  const getResultForEmail = (email: string) =>
    inviteResults.find((r) => r.email === email);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* ── Formulário de convite ── */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Convidar por e-mail
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onAddToStaging)}
          sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}
        >
          <GenericTextField
            name="email"
            control={control}
            label="E-mail do usuário"
            size={GeneralSize.Small}
          />
          <FormControl size="small" sx={{ minWidth: 120, mt: "4px" }}>
            <InputLabel>Papel</InputLabel>
            <Select
              value={selectedRole}
              label="Papel"
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {INVITABLE_ROLES.map((r) => (
                <MenuItem key={r} value={r}>
                  {ROLE_LABELS[r]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <GenericButton
            label="Adicionar"
            type="submit"
            variant={ButtonVariant.Outlined}
            size={GeneralSize.Small}
            sx={{ mt: "4px" }}
          />
        </Box>
        {stagingError && (
          <Alert severity="error" sx={{ mt: 1 }} onClose={() => setStagingError(null)}>
            {stagingError}
          </Alert>
        )}
      </Box>

      {/* ── Staging list ── */}
      {stagingList.length > 0 && (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Emails a convidar
          </Typography>
          <List dense disablePadding>
            {stagingList.map((entry) => {
              const result = getResultForEmail(entry.email);
              return (
                <ListItem
                  key={entry.email}
                  disableGutters
                  secondaryAction={
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => onRemoveFromStaging(entry.email)}
                    >
                      <GenericIcon icon="close" size={GeneralSize.Small} />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {entry.email}
                        <Select
                          size="small"
                          value={entry.role}
                          onChange={(e) =>
                            onChangeRoleInStaging(entry.email, e.target.value)
                          }
                          sx={{ fontSize: "0.75rem", height: 28 }}
                        >
                          {INVITABLE_ROLES.map((r) => (
                            <MenuItem key={r} value={r} sx={{ fontSize: "0.75rem" }}>
                              {ROLE_LABELS[r]}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                    }
                    secondary={
                      result ? (
                        result.alreadyMember ? (
                          <Typography variant="caption" color="info.main">
                            Já é membro do projeto.
                          </Typography>
                        ) : result.registered ? (
                          <Typography variant="caption" color="success.main">
                            Adicionado ao projeto.
                          </Typography>
                        ) : (
                          <Typography variant="caption" color="warning.main">
                            ⚠ Não possui conta cadastrada. Um convite foi enviado por e-mail.
                          </Typography>
                        )
                      ) : null
                    }
                  />
                </ListItem>
              );
            })}
          </List>

          <Box sx={{ mt: 1 }}>
            <GenericButton
              label={saving ? "Enviando..." : "Enviar convites"}
              variant={ButtonVariant.Contained}
              size={GeneralSize.Small}
              disabled={saving}
              onClick={onSendInvites}
              startIcon={saving ? undefined : "send"}
            />
          </Box>
        </Box>
      )}

      <Divider />

      {/* ── Membros atuais ── */}
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Membros do projeto
        </Typography>
        <List dense>
          {currentMembers.map((member) => {
            const isSuperAdmin = member.role.name === "SuperAdmin";
            const isRemoving = removingId === member.userId;
            return (
              <ListItem
                key={member.id}
                secondaryAction={
                  !isSuperAdmin && (
                    <IconButton
                      edge="end"
                      size="small"
                      disabled={isRemoving}
                      onClick={() => onRemoveMember(member)}
                    >
                      {isRemoving ? (
                        <CircularProgress size={16} />
                      ) : (
                        <GenericIcon icon="delete" size={GeneralSize.Small} />
                      )}
                    </IconButton>
                  )
                }
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {`${member.user.firstName} ${member.user.lastName}`}
                      <Chip
                        label={ROLE_LABELS[member.role.name] ?? member.role.name}
                        size="small"
                        color={isSuperAdmin ? "primary" : "default"}
                      />
                    </Box>
                  }
                  secondary={member.user.email}
                />
              </ListItem>
            );
          })}
          {currentMembers.length === 0 && (
            <ListItem>
              <ListItemText
                primary="Nenhum membro no projeto."
                sx={{ color: "text.secondary" }}
              />
            </ListItem>
          )}
        </List>
      </Box>
    </Box>
  );
}
