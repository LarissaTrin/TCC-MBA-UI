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
import {
  Box,
  Grid,
  IconButton,
  MenuItem,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useRef, useState } from "react";
import { CardFormData, cardSchema } from "@/common/schemas/cardSchema";
import { mapToOptions } from "@/common/utils/mapToOptions";
import dayjs from "dayjs";

import { CardApproversSection } from "./CardApproversSection";
import { CardCommentsSection } from "./CardCommentsSection";
import { CardDependenciesSection } from "./CardDependenciesSection";
import { CardHistorySection } from "./CardHistorySection";
import { CardTagsSection } from "./CardTagsSection";
import { CardTasksSection } from "./CardTasksSection";

interface CardContentProps {
  id?: string;
  sections: Section[];
  onClose: () => void;
  userRole?: string;
  projectMembers?: ProjectMember[];
  projectId?: number;
  onOpenCard?: (cardId: number) => void;
  extraZIndex?: number;
}

const TABS = [
  { label: "Details", value: 0 },
  { label: "Tasks", value: 1 },
  { label: "Approvers & Deps", value: 2 },
  { label: "Comments", value: 3 },
  { label: "History", value: 4 },
];

export function CardContent({
  id,
  sections,
  onClose,
  userRole = "User",
  projectMembers = [],
  projectId,
  onOpenCard,
  extraZIndex = 0,
}: CardContentProps) {
  const canDeleteCard = ["SuperAdmin", "Admin"].includes(userRole);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<Card | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [openOptions, setOpenOptions] = useState(false);
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
        user: { id: 0, firstName: t.userName ?? "", lastName: "", email: "" },
      })),
      approvers: (data.approvers ?? []).map((a) => ({
        id: a.id,
        environment: a.environment,
        user: { id: a.userId ? Number(a.userId) : 0, firstName: a.userName ?? "", lastName: "", email: "" },
      })),
      tags: (data.tags ?? []).map((t) => ({ id: t.id, name: t.name })),
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

  useEffect(() => {
    if (!id) return;

    setIsDrawerOpen(true);
    setLoading(true);
    setActiveTab(0);

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
              userName: a.user ? `${a.user.firstName} ${a.user.lastName}`.trim() : "",
              userId: a.user?.id ? String(a.user.id) : "",
            })),
            tags: (loadedCard.tags ?? []).map((t) => ({ id: t.id, name: t.name })),
          });
          setInitialComments(loadedCard.comments ?? []);
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, form]);

  const renderHeader = () => {
    if (!card) return <Box>Card</Box>;

    return (
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 0.75 }}>
        {/* Row 1: ID + title + actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
            #{card.sortIndex}
          </Typography>
          <Box sx={{ flex: 1 }}>
            <GenericTextField
              name="name"
              label=""
              size={GeneralSize.Small}
              control={form.control}
            />
          </Box>
          <Tooltip title={isFullScreen ? "Sair do full screen" : "Expandir"}>
            <IconButton size="small" onClick={() => setIsFullScreen((v) => !v)}>
              <span className="material-icons" style={{ fontSize: 20 }}>
                {isFullScreen ? "fullscreen_exit" : "fullscreen"}
              </span>
            </IconButton>
          </Tooltip>
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

        {/* Row 2: Tags */}
        <CardTagsSection control={form.control} />
      </Box>
    );
  };

  const drawerSx = {
    zIndex: 1501 + extraZIndex,
    "& .MuiDrawer-paper": {
      width: isFullScreen ? "100vw" : { xs: "100%", sm: 540 },
      transition: "width 0.25s ease",
    },
  };

  if (loading) {
    return (
      <GenericDrawer
        open={isDrawerOpen}
        onClose={handleClose}
        anchor="right"
        sx={drawerSx}
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
      sx={drawerSx}
      disableIcon
      headerTitle={renderHeader()}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}
      >
        {/* Tabs bar */}
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: "divider", flexShrink: 0 }}
        >
          {TABS.map((t) => (
            <Tab key={t.value} label={t.label} value={t.value} sx={{ minWidth: 90 }} />
          ))}
        </Tabs>

        {/* Tab content */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          {/* Tab 0 — Details */}
          {activeTab === 0 && (
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
                  slotProps={{ input: { inputProps: { min: 0, step: 1 } } }}
                />
              </Grid>
              <Grid size={6}>
                <GenericTextField
                  name="priority"
                  label="Priority"
                  control={form.control}
                  type="number"
                  slotProps={{ input: { inputProps: { min: 0, step: 1 } } }}
                />
              </Grid>
              <Grid size={12}>
                <GenericTextField
                  name="description"
                  label="Description"
                  multiline
                  minRows={isFullScreen ? 8 : 5}
                  maxRows={isFullScreen ? 20 : 10}
                  control={form.control}
                />
              </Grid>
            </Grid>
          )}

          {/* Tab 1 — Tasks */}
          {activeTab === 1 && <CardTasksSection control={form.control} />}

          {/* Tab 2 — Approvers & Dependencies */}
          {activeTab === 2 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <CardApproversSection control={form.control} memberOptions={memberOptions} />
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                  Dependências
                </Typography>
                <CardDependenciesSection
                  cardId={card?.id ?? 0}
                  projectId={projectId}
                  onOpenCard={onOpenCard}
                />
              </Box>
            </Box>
          )}

          {/* Tab 3 — Comments */}
          {activeTab === 3 && (
            <CardCommentsSection
              cardId={card?.id ?? 0}
              initialComments={initialComments}
            />
          )}

          {/* Tab 4 — History */}
          {activeTab === 4 && <CardHistorySection cardId={card?.id ?? 0} />}
        </Box>
      </Box>
    </GenericDrawer>
  );
}
