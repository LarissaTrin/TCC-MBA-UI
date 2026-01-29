"use client";

import { GeneralSize, ButtonVariant, Status } from "@/common/enum";
import { Card } from "@/common/model";
import { cardService } from "@/common/services";
import {
  GenericDrawer,
  GenericTextField,
  GenericButton,
  GenericButtonGroup,
  GenericPoper,
  GenericIcon,
} from "@/components/widgets";
import { Box, Divider, Grid, MenuItem } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { CardFormData, cardSchema } from "@/common/schemas/cardSchema";

interface CardContentProps {
  id?: string;
  onClose: () => void;
}

export function CardContent({ id, onClose }: CardContentProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<Card | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [openOptions, setOpenOptions] = useState(false);

  // RHF + Zod
  const form = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      id: 0,
      name: "",
      description: "",
      user: "",
      status: "",
      date: "",
      priority: "",
      task: "",
      approver: "",
    },
  });

  const {
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = form;

  const handleOptions = () => setOpenOptions((prev) => !prev);
  const handleCloseOptions = () => setOpenOptions(false);

  const onSubmit = async (data: CardFormData) => {
    if (!card) return;

    const payload: Partial<Card> = {
      ...card,
      name: data.name,
      description: data.description,
      // user: data.user || undefined,
      status: data.status as Status,
      dueDate: data.date || undefined,
      priority: data.priority || undefined,
      // task: data.task || undefined,
      // approver: data.approver || undefined,
    };

    console.log("Saving:", payload);
    // await cardService.update(payload);
    handleClose();
  };

  const handleClose = () => {
    handleCloseOptions();
    setIsDrawerOpen(false);
    onClose();
  };

  // Carrega dados e popula form
  useEffect(() => {
    if (!id) return;

    setIsDrawerOpen(true);
    setLoading(true);

    cardService
      .getById(Number(id))
      .then((cardResponse) => {
        const loadedCard = cardResponse ?? null;
        setCard(loadedCard);

        if (loadedCard) {
          // Popula form com dados carregados
          form.reset({
            id: loadedCard.id,
            name: loadedCard.name ?? "",
            description: loadedCard.description ?? "",
            user: loadedCard.user?.firstName ?? "",
            status: loadedCard.status ?? "",
            date: loadedCard.dueDate ?? "",
            priority: loadedCard.priority ?? "",
            // task: loadedCard.task ?? "",
            // approver: loadedCard.approver ?? "",
          });
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, form]);

  const renderTitle = () => {
    if (!card) return <Box>Card</Box>;

    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box sx={{ fontWeight: 600 }}>{card.id}</Box>
        <Box sx={{ flex: 1 }}>
          <GenericTextField
            name="name" // RHF gerencia
            label=""
            size={GeneralSize.Small}
            control={form.control} // ← RHF mode
          />
        </Box>
        <GenericButtonGroup
          size={GeneralSize.Small}
          variant={ButtonVariant.Outlined}
          ref={anchorRef}
        >
          <GenericButton
            label="Save"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || isSubmitting}
          />
          <GenericButton startIcon="more_vert" onClick={handleOptions} />
        </GenericButtonGroup>
        <GenericPoper
          anchorRef={anchorRef}
          open={openOptions}
          onClose={handleCloseOptions}
        >
          <MenuItem onClick={handleSubmit(onSubmit)}>Save and Close</MenuItem>
          <MenuItem onClick={handleClose}>Close</MenuItem>
        </GenericPoper>
      </Box>
    );
  };

  if (loading) {
    return (
      <GenericDrawer
        open={isDrawerOpen}
        onClose={handleClose}
        anchor="right"
        sx={{ zIndex: 1501 }}
        disableIcon
      >
        <Box sx={{ padding: 2 }}>Carregando...</Box>
      </GenericDrawer>
    );
  }

  return (
    <GenericDrawer
      open={isDrawerOpen}
      onClose={handleClose}
      anchor="right"
      sx={{ zIndex: 1501 }}
      disableIcon
      headerTitle={renderTitle()}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ padding: 2, maxWidth: 500 }}
      >
        <Grid container spacing={2}>
          <Grid size={6}>
            <GenericTextField name="user" label="User" control={form.control} />
          </Grid>
          <Grid size={6}>
            <GenericTextField
              name="status"
              label="Status"
              control={form.control}
            />
          </Grid>

          <Grid size={6}>
            <GenericTextField
              name="date"
              label="Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              control={form.control}
            />
          </Grid>
          <Grid size={6}>
            <GenericTextField
              name="priority"
              label="Priority"
              control={form.control}
            />
          </Grid>

          <Grid size={12}>
            <Divider />
          </Grid>

          <Grid size={12}>
            <GenericTextField
              name="description"
              label="Description"
              multiline
              minRows={5}
              maxRows={10}
              control={form.control}
            />
          </Grid>

          <Grid size={12}>
            <Divider />
          </Grid>

          <Grid size={12}>
            <GenericTextField name="task" label="Task" control={form.control} />
          </Grid>

          <Grid size={12}>
            <Divider />
          </Grid>

          <Grid size={12}>
            <GenericTextField
              name="approver"
              label="Approver"
              control={form.control}
            />
          </Grid>
        </Grid>
      </Box>
    </GenericDrawer>
  );
}
