"use client";

import { GeneralSize, ButtonVariant, Status } from "@/common/enum";
import { Card, ProjectMember, Section, Comments } from "@/common/model";
import { cardService } from "@/common/services";
import {
  GenericDrawer,
  GenericTextField,
  GenericButton,
  GenericButtonGroup,
  GenericPoper,
  GenericAutoComplete,
} from "@/components/widgets";
import { Box, Divider, Grid, MenuItem, Typography } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useRef, useState } from "react";
import { CardFormData, cardSchema } from "@/common/schemas/cardSchema";
import { mapToOptions } from "@/common/utils/mapToOptions";
import dayjs from "dayjs";

import { CardApproversSection } from "./CardApproversSection";
import { CardCommentsSection } from "./CardCommentsSection";
import { CardHistorySection } from "./CardHistorySection";
import { CardTagsSection } from "./CardTagsSection";
import { CardTasksSection } from "./CardTasksSection";

interface CardContentProps {
  id?: string;
  sections: Section[];
  onClose: () => void;
  userRole?: string;
  projectMembers?: ProjectMember[];
}

export function CardContent({ id, sections, onClose, userRole = "User", projectMembers = [] }: CardContentProps) {
  const canDeleteCard = ["SuperAdmin", "Admin"].includes(userRole);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<Card | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [openOptions, setOpenOptions] = useState(false);

  // Comments are decoupled — managed by CardCommentsSection with immediate API calls
  const [initialComments, setInitialComments] = useState<Comments[]>([]);

  const sectionOptions = useMemo(() => mapToOptions(sections), [sections]);
  const memberOptions = useMemo(
    () =>
      projectMembers.map((m) => ({
        value: String(m.userId),
        label: `${m.user.firstName} ${m.user.lastName}`.trim(),
      })),
    [projectMembers],
  );

  // RHF + Zod (tasks and approvers are part of the form via useFieldArray)
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
      sectionId: "",
      storyPoints: "",
      tasks: [],
      approvers: [],
      tags: [],
    },
  });

  const {
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = form;

  const handleOptions = () => setOpenOptions((prev) => !prev);
  const handleCloseOptions = () => setOpenOptions(false);

  const handleDeleteCard = async () => {
    if (!card) return;
    await cardService.delete(card.id);
    handleClose();
  };

  const onSubmit = async (data: CardFormData) => {
    if (!card) return;

    const payload: Partial<Card> = {
      ...card,
      name: data.name,
      description: data.description,
      status: data.status as Status,
      dueDate: data.date || undefined,
      priority: data.priority ? Number(data.priority) : undefined,
      storyPoints: data.storyPoints ? Number(data.storyPoints) : undefined,
      tasks: (data.tasks ?? []).map((t) => ({
        id: t.id,
        title: t.title,
        date: t.date ? dayjs(t.date) : dayjs(),
        completed: t.completed,
        user: {
          id: 0,
          firstName: t.userName ?? "",
          lastName: "",
          email: "",
        },
      })),
      approvers: (data.approvers ?? []).map((a) => ({
        id: a.id,
        environment: a.environment,
        user: {
          id: 0,
          firstName: a.userName ?? "",
          lastName: "",
          email: "",
        },
      })),
      tags: (data.tags ?? []).map((t) => ({
        id: t.id,
        name: t.name,
      })),
      // Comments are saved independently via commentService
    };

    await cardService.update(card.id, {
      title: payload.name,
      description: payload.description,
      priority: payload.priority,
      storyPoints: payload.storyPoints,
      date: payload.dueDate,
      listId: data.sectionId ? Number(data.sectionId) : undefined,
      userId: data.user ? Number(data.user) : undefined,
    });
    handleClose();
  };

  const handleClose = () => {
    handleCloseOptions();
    setIsDrawerOpen(false);
    onClose();
  };

  // Load card data and populate form + comments
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
          form.reset({
            id: loadedCard.id,
            name: loadedCard.name ?? "",
            description: loadedCard.description ?? "",
            user: loadedCard.user?.id ? String(loadedCard.user.id) : "",
            status: loadedCard.status ?? "",
            date: loadedCard.dueDate ?? "",
            priority: loadedCard.priority?.toString() ?? "",
            storyPoints: loadedCard.storyPoints?.toString() ?? "",
            sectionId: loadedCard.sectionId ?? "",
            tasks: (loadedCard.tasks ?? []).map((t) => ({
              id: t.id,
              title: t.title,
              date: t.date ? dayjs(t.date).format("YYYY-MM-DD") : "",
              completed: t.completed,
              userName: t.user?.firstName ?? "",
            })),
            approvers: (loadedCard.approvers ?? []).map((a) => ({
              id: a.id,
              environment: a.environment,
              userName: a.user?.firstName ?? "",
            })),
            tags: (loadedCard.tags ?? []).map((t) => ({
              id: t.id,
              name: t.name,
            })),
          });

          setInitialComments(loadedCard.comments ?? []);
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
            name="name"
            label=""
            size={GeneralSize.Small}
            control={form.control}
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
          {canDeleteCard && (
            <MenuItem onClick={handleDeleteCard} sx={{ color: "error.main" }}>
              Deletar card
            </MenuItem>
          )}
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
            <GenericAutoComplete
              label="User"
              options={memberOptions}
              name="user"
              control={form.control}
            />
          </Grid>
          <Grid size={6}>
            <GenericAutoComplete
              label="Section"
              options={sectionOptions}
              name="sectionId"
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
              name="storyPoints"
              label="Story Points"
              control={form.control}
              type="number"
              slotProps={{
                input: {
                  inputProps: {
                    min: 0,
                    step: 1,
                  },
                },
              }}
            />
          </Grid>
          <Grid size={6}>
            <GenericTextField
              name="priority"
              label="Priority"
              control={form.control}
              type="number"
              slotProps={{
                input: {
                  inputProps: {
                    min: 0,
                    step: 1,
                  },
                },
              }}
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

          {/* ── Tags ── */}
          <Grid size={12}>
            <Divider />
          </Grid>
          <Grid size={12}>
            <CardTagsSection control={form.control} />
          </Grid>

          {/* ── Tasks ── */}
          <Grid size={12}>
            <Divider />
          </Grid>
          <Grid size={12}>
            <CardTasksSection control={form.control} />
          </Grid>

          {/* ── Approvers ── */}
          <Grid size={12}>
            <Divider />
          </Grid>
          <Grid size={12}>
            <CardApproversSection control={form.control} />
          </Grid>

          {/* ── Comments ── */}
          <Grid size={12}>
            <Divider />
          </Grid>
          <Grid size={12}>
            <CardCommentsSection
              cardId={card?.id ?? 0}
              initialComments={initialComments}
            />
          </Grid>

          {/* ── Histórico ── */}
          <Grid size={12}>
            <Divider />
          </Grid>
          <Grid size={12}>
            <Typography variant="subtitle2" gutterBottom>
              Histórico
            </Typography>
            <CardHistorySection cardId={card?.id ?? 0} />
          </Grid>
        </Grid>
      </Box>
    </GenericDrawer>
  );
}
