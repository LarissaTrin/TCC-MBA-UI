"use client";

import { useState } from "react";
import { Box, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenericButton, GenericTextField, GenericIcon } from "@/components/widgets";
import {
  addUserSchema,
  AddUserData,
} from "@/common/schemas/projectSettingsSchema";
import { ButtonVariant, GeneralSize } from "@/common/enum";

interface ProjectUser {
  id: string;
  name: string;
  email: string;
}

const MOCK_USERS: ProjectUser[] = [
  { id: "1", name: "Name 1", email: "email1@email.com" },
  { id: "2", name: "Name 2", email: "email2@email.com" },
  { id: "3", name: "Name 3", email: "email3@email.com" },
];

export function ProjectSettingsUsers() {
  const [users, setUsers] = useState<ProjectUser[]>(MOCK_USERS);

  const { control, handleSubmit, reset } = useForm<AddUserData>({
    resolver: zodResolver(addUserSchema),
    defaultValues: { email: "" },
  });

  const onAddUser = (data: AddUserData) => {
    const newUser: ProjectUser = {
      id: String(Date.now()),
      name: data.email.split("@")[0],
      email: data.email,
    };
    setUsers((prev) => [...prev, newUser]);
    reset({ email: "" });
  };

  const onRemoveUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        component="form"
        onSubmit={handleSubmit(onAddUser)}
        sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}
      >
        <GenericTextField
          name="email"
          control={control}
          label="E-mail do usuário"
          size={GeneralSize.Small}
        />
        <GenericButton
          label="Adicionar"
          type="submit"
          variant={ButtonVariant.Contained}
          size={GeneralSize.Small}
          sx={{ mt: "4px" }}
        />
      </Box>

      <List dense>
        {users.map((user) => (
          <ListItem
            key={user.id}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="remover"
                onClick={() => onRemoveUser(user.id)}
              >
                <GenericIcon icon="delete" size={GeneralSize.Small} />
              </IconButton>
            }
          >
            <ListItemText primary={user.name} secondary={user.email} />
          </ListItem>
        ))}
        {users.length === 0 && (
          <ListItem>
            <ListItemText
              primary="Nenhum usuário no projeto."
              sx={{ color: "text.secondary" }}
            />
          </ListItem>
        )}
      </List>
    </Box>
  );
}
