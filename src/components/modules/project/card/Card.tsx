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
  GenericIcon,
} from "@/components/widgets";
import {
  Box,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useRef, useState } from "react";
import { CardFormData, cardSchema } from "@/common/schemas/cardSchema";
import { mapToOptions } from "@/common/utils/mapToOptions";
import dayjs from "dayjs";
import { useTranslation } from "@/common/provider";
import { useNavigation, useProjectMemberSearch } from "@/common/hooks";

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
  onSaved?: (card: Card) => void;
  userRole?: string;
  projectMembers?: ProjectMember[];
  projectId?: number;
  onOpenCard?: (cardId: number) => void;
  extraZIndex?: number;
  homeMode?: boolean;
  sectionNameMap?: Record<string, string>;
}

export function CardContent({
  id,
  sections,
  onClose,
  onSaved,
  userRole = "User",
  projectMembers = [],
  projectId,
  onOpenCard,
  extraZIndex = 0,
  homeMode = false,
  sectionNameMap = {},
}: CardContentProps) {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const canDeleteCard = !homeMode && ["SuperAdmin", "Admin"].includes(userRole);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState<Card | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [openOptions, setOpenOptions] = useState(false);
  const [initialComments, setInitialComments] = useState<Comments[]>([]);

  const TABS = [
    { label: t("card.tabs.details"), value: 0 },
    { label: t("card.tabs.tasks"), value: 1 },
    { label: t("card.tabs.approversAndDeps"), value: 2 },
    { label: t("card.tabs.comments"), value: 3 },
    { label: t("card.tabs.history"), value: 4 },
  ];

  const sectionOptions = useMemo(() => mapToOptions(sections), [sections]);
  const userSearch = useProjectMemberSearch(projectId);

  const form = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    mode: "onTouched",
    defaultValues: {
      id: 0,
      name: "",
      description: "",
      user: "",
      status: "",
      date: "",
      startDate: "",
      endDate: "",
      priority: "",
      sectionId: "",
      storyPoints: "",
      tasks: [],
      approvers: [],
      tags: [],
      blocked: false,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
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
          id: t.userId ? Number(t.userId) : 0,
          firstName: t.userName ?? "",
          lastName: "",
          email: "",
        },
      })),
      approvers: (data.approvers ?? []).map((a) => ({
        id: a.id,
        environment: a.environment,
        user: {
          id: a.userId ? Number(a.userId) : 0,
          firstName: a.userName ?? "",
          lastName: "",
          email: "",
        },
      })),
      tags: (data.tags ?? []).map((t) => ({ id: t.id, name: t.name })),
    };

    const updatedCard = await cardService.update(card.id, {
      title: payload.name,
      description: payload.description,
      priority: payload.priority,
      storyPoints: payload.storyPoints,
      date: payload.dueDate,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
      listId: data.sectionId ? Number(data.sectionId) : undefined,
      userId: data.user ? Number(data.user) : undefined,
      blocked: data.blocked,
      tagCards: (data.tags ?? []).map((t) => ({ tagId: t.id, name: t.name })),
      approvers: (data.approvers ?? []).map((a) => ({
        id: a.id > 1_000_000_000 ? undefined : a.id,
        environment: a.environment,
        userId: a.userId ? Number(a.userId) : undefined,
      })),
      tasksCard: (data.tasks ?? []).map((t) => ({
        id: t.id > 1_000_000_000 ? undefined : t.id,
        title: t.title,
        date: t.date || undefined,
        completed: t.completed,
        userId: t.userId ? Number(t.userId) : undefined,
      })),
    });
    onSaved?.(updatedCard);
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
          if (loadedCard.user?.id) {
            userSearch.seedOption({
              value: String(loadedCard.user.id),
              label:
                `${loadedCard.user.firstName} ${loadedCard.user.lastName}`.trim(),
            });
          }

          form.reset({
            id: loadedCard.id,
            name: loadedCard.name ?? "",
            description: loadedCard.description ?? "",
            user: loadedCard.user?.id ? String(loadedCard.user.id) : "",
            status: loadedCard.status ?? "",
            date: loadedCard.dueDate ?? "",
            startDate: loadedCard.startDate ?? "",
            endDate: loadedCard.endDate ?? "",
            priority: loadedCard.priority?.toString() ?? "",
            storyPoints: loadedCard.storyPoints?.toString() ?? "",
            sectionId: loadedCard.sectionId ?? "",
            tasks: (loadedCard.tasks ?? []).map((t) => ({
              id: t.id,
              title: t.title,
              date: t.date ? dayjs(t.date).format("YYYY-MM-DD") : "",
              completed: t.completed,
              userName: t.user
                ? `${t.user.firstName} ${t.user.lastName}`.trim()
                : "",
              userId: t.user?.id ? String(t.user.id) : "",
            })),
            approvers: (loadedCard.approvers ?? []).map((a) => ({
              id: a.id,
              environment: a.environment,
              userName: a.user
                ? `${a.user.firstName} ${a.user.lastName}`.trim()
                : "",
              userId: a.user?.id ? String(a.user.id) : "",
            })),
            tags: (loadedCard.tags ?? []).map((t) => ({
              id: t.id,
              name: t.name,
            })),
            blocked: loadedCard.blocked ?? false,
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 0.75,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 600, whiteSpace: "nowrap" }}
          >
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
          {homeMode && projectId && (
            <Tooltip title={t("card.viewInProject")}>
              <IconButton
                size="small"
                onClick={() => navigate(`/project/${projectId}`)}
              >
                <GenericIcon icon="open_in_new" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip
            title={isFullScreen ? t("card.exitFullscreen") : t("card.expand")}
          >
            <IconButton size="small" onClick={() => setIsFullScreen((v) => !v)}>
              <GenericIcon
                icon={isFullScreen ? "fullscreen_exit" : "fullscreen"}
              />
            </IconButton>
          </Tooltip>
          <GenericButtonGroup
            size={GeneralSize.Small}
            variant={ButtonVariant.Outlined}
            ref={anchorRef}
          >
            <GenericButton
              label={t("card.save")}
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            />
            <GenericButton startIcon="more_vert" onClick={handleOptions} />
          </GenericButtonGroup>
          <GenericPoper
            anchorRef={anchorRef}
            open={openOptions}
            onClose={handleCloseOptions}
          >
            <MenuItem onClick={handleSubmit(onSubmit)}>
              {t("card.saveAndClose")}
            </MenuItem>
            <MenuItem onClick={handleClose}>{t("card.close")}</MenuItem>
            {canDeleteCard && (
              <MenuItem onClick={handleDeleteCard} sx={{ color: "error.main" }}>
                {t("card.delete")}
              </MenuItem>
            )}
          </GenericPoper>
        </Box>

        <CardTagsSection control={form.control} projectId={projectId} />
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
        <Box sx={{ padding: 2 }}>{t("card.loading")}</Box>
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
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: "divider", flexShrink: 0 }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              value={tab.value}
              sx={{ minWidth: 90 }}
            />
          ))}
        </Tabs>

        <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          {activeTab === 0 && (
            <Grid container spacing={2}>
              <Grid size={6}>
                {homeMode ? (
                  <TextField
                    label={t("card.details.user")}
                    value={
                      card?.user
                        ? `${card.user.firstName} ${card.user.lastName}`.trim()
                        : "—"
                    }
                    size="small"
                    fullWidth
                    disabled
                  />
                ) : (
                  <GenericAutoComplete
                    label={t("card.details.user")}
                    options={userSearch.options}
                    loading={userSearch.loading}
                    filterOptions={(x) => x}
                    onInputChange={(_, value, reason) => {
                      if (reason === "input") userSearch.search(value);
                    }}
                    name="user"
                    control={form.control}
                  />
                )}
              </Grid>
              <Grid size={6}>
                {homeMode ? (
                  <TextField
                    label={t("card.details.section")}
                    value={
                      card?.sectionId
                        ? (sectionNameMap[card.sectionId] ?? card.sectionId)
                        : "—"
                    }
                    size="small"
                    fullWidth
                    disabled
                  />
                ) : (
                  <GenericAutoComplete
                    label={t("card.details.section")}
                    options={sectionOptions}
                    name="sectionId"
                    control={form.control}
                  />
                )}
              </Grid>
              <Grid size={6}>
                <GenericTextField
                  name="startDate"
                  label={t("card.details.startDate")}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  control={form.control}
                />
              </Grid>
              <Grid size={6}>
                <GenericTextField
                  name="endDate"
                  label={t("card.details.endDate")}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  control={form.control}
                />
              </Grid>
              <Grid size={6}>
                <GenericTextField
                  name="date"
                  label={t("card.details.date")}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  control={form.control}
                />
              </Grid>
              <Grid size={6}>
                <GenericTextField
                  name="storyPoints"
                  label={t("card.details.storyPoints")}
                  control={form.control}
                  type="number"
                  slotProps={{ input: { inputProps: { min: 0, step: 1 } } }}
                />
              </Grid>
              <Grid size={6}>
                <GenericTextField
                  name="priority"
                  label={t("card.details.priority")}
                  control={form.control}
                  type="number"
                  slotProps={{ input: { inputProps: { min: 0, step: 1 } } }}
                />
              </Grid>
              <Grid size={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!form.watch("blocked")}
                      onChange={(e) =>
                        form.setValue("blocked", e.target.checked)
                      }
                      color="error"
                    />
                  }
                  label={
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Typography
                        variant="body2"
                        color={
                          form.watch("blocked") ? "error" : "text.secondary"
                        }
                      >
                        Blocked
                      </Typography>
                    </Box>
                  }
                />
              </Grid>
              <Grid size={12}>
                <GenericTextField
                  name="description"
                  label={t("card.details.description")}
                  multiline
                  minRows={isFullScreen ? 8 : 5}
                  maxRows={isFullScreen ? 20 : 10}
                  control={form.control}
                />
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <CardTasksSection form={form} projectId={projectId} />
          )}

          {activeTab === 2 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <CardApproversSection
                form={form}
                projectId={projectId}
                readOnly={homeMode}
              />
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                  {t("card.dependencies.title")}
                </Typography>
                <CardDependenciesSection
                  cardId={card?.id ?? 0}
                  projectId={projectId}
                  onOpenCard={onOpenCard}
                  readOnly={homeMode}
                />
              </Box>
            </Box>
          )}

          {activeTab === 3 && (
            <CardCommentsSection
              cardId={card?.id ?? 0}
              initialComments={initialComments}
            />
          )}

          {activeTab === 4 && <CardHistorySection cardId={card?.id ?? 0} />}
        </Box>
      </Box>
    </GenericDrawer>
  );
}
