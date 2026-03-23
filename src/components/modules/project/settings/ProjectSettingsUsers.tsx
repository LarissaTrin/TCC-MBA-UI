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
  Tooltip,
  Popover,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GenericButton,
  GenericTextField,
  GenericIcon,
} from "@/components/widgets";
import { useLoading } from "@/common/context/LoadingContext";
import {
  addUserSchema,
  AddUserData,
} from "@/common/schemas/projectSettingsSchema";
import { ButtonVariant, GeneralSize, GeneralColor } from "@/common/enum";
import { InviteUserResult, ProjectMember } from "@/common/model";
import { projectService } from "@/common/services";
import { useTranslation } from "@/common/provider";

interface StagingEntry {
  email: string;
  role: string;
}

interface ProjectSettingsUsersProps {
  projectId: number;
  currentMembers: ProjectMember[];
  onMembersUpdate: (members: ProjectMember[]) => void;
  currentUserRole?: string;
  currentUserId?: number;
}

const ROLES_BY_PERMISSION: Record<string, string[]> = {
  SuperAdmin: ["User", "Leader", "Admin"],
  Admin: ["User", "Leader"],
};

export function ProjectSettingsUsers({
  projectId,
  currentMembers,
  onMembersUpdate,
  currentUserRole = "User",
  currentUserId,
}: ProjectSettingsUsersProps) {
  const { t } = useTranslation();
  const { withLoading } = useLoading();
  const [stagingList, setStagingList] = useState<StagingEntry[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("User");
  const [inviteResults, setInviteResults] = useState<InviteUserResult[]>([]);
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [stagingError, setStagingError] = useState<string | null>(null);
  const [rolesAnchorEl, setRolesAnchorEl] = useState<HTMLElement | null>(null);
  const [pendingRemove, setPendingRemove] = useState<ProjectMember | null>(null);
  const [updatingRoleId, setUpdatingRoleId] = useState<number | null>(null);

  const canManageRoles = ["SuperAdmin", "Admin"].includes(currentUserRole);

  const ROLE_LABELS: Record<string, string> = {
    User: t("settings.users.roles.User"),
    Leader: t("settings.users.roles.Leader"),
    Admin: t("settings.users.roles.Admin"),
    SuperAdmin: "SuperAdmin",
  };

  const INVITABLE_ROLES = ROLES_BY_PERMISSION[currentUserRole] ?? [];

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
      setStagingError(t("settings.users.alreadyMember"));
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
      const response = await withLoading(() =>
        projectService.inviteUsers(
          projectId,
          stagingList.map((s) => ({ email: s.email, role: s.role })),
        ),
      );
      setInviteResults(response.results);

      const newlyAdded = response.results.filter(
        (r) => r.registered && !r.alreadyMember,
      );
      if (newlyAdded.length > 0) {
        const detail = await withLoading(() =>
          projectService.getDetailById(projectId),
        );
        if (detail) onMembersUpdate(detail.projectUsers);
        setStagingList((prev) =>
          prev.filter((s) => !newlyAdded.some((r) => r.email === s.email)),
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const onRemoveMember = async () => {
    if (!pendingRemove) return;
    const member = pendingRemove;
    setPendingRemove(null);
    setRemovingId(member.userId);
    try {
      await withLoading(() =>
        projectService.removeMember(projectId, member.userId),
      );
      onMembersUpdate(currentMembers.filter((m) => m.userId !== member.userId));
    } finally {
      setRemovingId(null);
    }
  };

  const onChangeMemberRole = async (member: ProjectMember, newRole: string) => {
    setUpdatingRoleId(member.userId);
    try {
      await withLoading(() =>
        projectService.updateMemberRole(projectId, member.userId, newRole),
      );
      onMembersUpdate(
        currentMembers.map((m) =>
          m.userId === member.userId
            ? { ...m, role: { ...m.role, name: newRole } }
            : m,
        ),
      );
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const getResultForEmail = (email: string) =>
    inviteResults.find((r) => r.email === email);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {canManageRoles && (
        <Box>
          <Typography
            variant="subtitle2"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {t("settings.users.inviteTitle")}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onAddToStaging)}
            sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}
          >
            <GenericTextField
              name="email"
              control={control}
              label={t("settings.users.emailLabel")}
              size={GeneralSize.Small}
            />
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
              <FormControl size="small" sx={{ minWidth: 120, mt: "4px" }}>
                <InputLabel>{t("settings.users.roleLabel")}</InputLabel>
                <Select
                  value={selectedRole}
                  label={t("settings.users.roleLabel")}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  {INVITABLE_ROLES.map((r) => (
                    <MenuItem key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <GenericButton
              label={t("settings.users.add")}
              type="submit"
              variant={ButtonVariant.Outlined}
              size={GeneralSize.Small}
              sx={{ mt: "4px" }}
            />
          </Box>
          {stagingError && (
            <Alert
              severity="error"
              sx={{ mt: 1 }}
              onClose={() => setStagingError(null)}
            >
              {stagingError}
            </Alert>
          )}
        </Box>
      )}

      <Popover
        open={Boolean(rolesAnchorEl)}
        anchorEl={rolesAnchorEl}
        onClose={() => setRolesAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box sx={{ p: 2, maxWidth: 320 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            {t("settings.users.rolesInfo.title")}
          </Typography>
          {[...INVITABLE_ROLES, "SuperAdmin"].map((role) => (
            <Box key={role} sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight="bold">
                {ROLE_LABELS[role] ?? role}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t(`settings.users.rolesInfo.${role}`)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Popover>

      {stagingList.length > 0 && (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {t("settings.users.pendingTitle")}
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
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
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
                            <MenuItem
                              key={r}
                              value={r}
                              sx={{ fontSize: "0.75rem" }}
                            >
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
                            {t("settings.users.resultAlreadyMember")}
                          </Typography>
                        ) : result.registered ? (
                          <Typography variant="caption" color="success.main">
                            {t("settings.users.resultAdded")}
                          </Typography>
                        ) : (
                          <Typography variant="caption" color="warning.main">
                            {t("settings.users.resultInviteSent")}
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
              label={
                saving ? t("settings.users.sending") : t("settings.users.send")
              }
              variant={ButtonVariant.Contained}
              size={GeneralSize.Small}
              disabled={saving}
              onClick={onSendInvites}
              startIcon={saving ? undefined : "send"}
            />
          </Box>
        </Box>
      )}

      {canManageRoles && <Divider />}

      <Box>
        <Typography
          variant="subtitle2"
          sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
        >
          {t("settings.users.membersTitle")}
          <Tooltip
            title={
              t("settings.users.rolesInfo.title") +
              t("settings.users.rolesInfo.clickForDetails")
            }
          >
            <IconButton
              size="small"
              onClick={(e) => setRolesAnchorEl(e.currentTarget)}
            >
              <GenericIcon icon="info" size={GeneralSize.Small} />
            </IconButton>
          </Tooltip>
        </Typography>
        <List dense>
          {currentMembers.map((member) => {
            const isSuperAdmin = member.role.name === "SuperAdmin";
            const isSelf = member.userId === currentUserId;
            const isRemoving = removingId === member.userId;
            return (
              <ListItem
                key={member.id}
                secondaryAction={
                  canManageRoles && !isSuperAdmin && !isSelf && (
                    <IconButton
                      edge="end"
                      size="small"
                      disabled={isRemoving}
                      onClick={() => setPendingRemove(member)}
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
                      {canManageRoles && !isSuperAdmin && !isSelf ? (
                        <Select
                          size="small"
                          value={member.role.name}
                          disabled={updatingRoleId === member.userId}
                          onChange={(e) => onChangeMemberRole(member, e.target.value)}
                          sx={{ fontSize: "0.75rem", height: 28 }}
                        >
                          {INVITABLE_ROLES.map((r) => (
                            <MenuItem key={r} value={r} sx={{ fontSize: "0.75rem" }}>
                              {ROLE_LABELS[r]}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        <Chip
                          label={ROLE_LABELS[member.role.name] ?? member.role.name}
                          size="small"
                          color={isSuperAdmin ? "primary" : "default"}
                        />
                      )}
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
                primary={t("settings.users.noMembers")}
                sx={{ color: "text.secondary" }}
              />
            </ListItem>
          )}
        </List>
      </Box>

      {/* Remove member confirmation dialog */}
      <Dialog open={Boolean(pendingRemove)} onClose={() => setPendingRemove(null)}>
        <DialogTitle>
          {t("settings.users.confirmRemoveTitle").replace(
            "{name}",
            pendingRemove
              ? `${pendingRemove.user.firstName} ${pendingRemove.user.lastName}`
              : "",
          )}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("settings.users.confirmRemoveText")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <GenericButton
            label={t("common.cancel")}
            variant={ButtonVariant.Text}
            onClick={() => setPendingRemove(null)}
          />
          <GenericButton
            label={t("settings.users.confirmRemove")}
            variant={ButtonVariant.Contained}
            color={GeneralColor.Error}
            onClick={onRemoveMember}
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
}
