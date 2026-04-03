"use client";

import { useEffect, useState } from "react";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { GenericTabs, GenericLoading } from "@/components";
import { GenericPage } from "@/components/widgets/Page";
import { Box, IconButton, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import { GenericIcon } from "@/components/widgets";
import { DashboardContent } from "@/components/modules/project/dashboard/Dashboard";
import { BoardContent } from "@/components/modules/project/board/Board";
import { TimelineContent } from "@/components/modules/project/timeline/Timeline";
import { CardContent } from "@/components/modules/project/card/Card";
import { ProjectSettingsDialog } from "@/components/modules/project/settings/ProjectSettingsDialog";
import { GenericButton } from "@/components/widgets";
import { ButtonVariant, GeneralSize } from "@/common/enum";
import { Card, ProjectMember, Section, Task } from "@/common/model";
import { projectService, sectionService } from "@/common/services";
import { useLoading } from "@/common/context/LoadingContext";
import { mapCardsToTasks } from "@/common/utils/cardMapper";
import { useTranslation } from "@/common/provider";

export default function ProjectPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { withLoading } = useLoading();
  const searchParams = useSearchParams();
  const params = useParams();
  const projectId = Number(params.id);
  const { data: session } = useSession();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [cardStack, setCardStack] = useState<string[]>([]);
  const openCard = (id: string) => setCardStack((prev) => [...prev, id]);
  const closeTopCard = () => setCardStack((prev) => prev.slice(0, -1));
  const [sections, setSections] = useState<Section[]>([]);
  const [timelineTasks, setTimelineTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
  const [userRole, setUserRole] = useState<string>("User");
  const [projectTitle, setProjectTitle] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [lastUpdatedCard, setLastUpdatedCard] = useState<Card | undefined>();
  const [deletedCardId, setDeletedCardId] = useState<number | undefined>();
  const [tabSwitching, setTabSwitching] = useState(false);

  // Load sections only (fast — Board loads cards itself with pagination)
  useEffect(() => {
    if (!projectId) return;
    withLoading(() => sectionService.getSectionsOnly(projectId)).then((secs) => {
      const orderedSections = [...secs].sort((a, b) => a.order - b.order);
      setSections(orderedSections);
      setLoading(false);
    });
  }, [projectId, withLoading]);

  // Load all cards for Timeline
  useEffect(() => {
    if (!projectId) return;
    sectionService.getListsWithCards(projectId).then(({ cards }) => {
      setTimelineTasks(mapCardsToTasks(cards));
    });
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;
    withLoading(() => projectService.getDetailById(projectId)).then((detail) => {
      if (!detail) return;
      setProjectMembers(detail.projectUsers);
      setProjectTitle(detail.projectName);
      setProjectDescription(detail.description ?? "");
      const currentUserId = session?.user?.id ? Number(session.user.id) : null;
      if (currentUserId !== null) {
        const myMembership = detail.projectUsers.find((pu) => pu.userId === currentUserId);
        setUserRole(myMembership?.role.name ?? "User");
      }
    });
  }, [projectId, session?.user?.id, withLoading]);

  const activeTabValue = searchParams.get("tab") || "dashboard";

  const tabsConfig = [
    {
      label: t("project.tabs.dashboard"),
      value: "dashboard",
      content: <DashboardContent projectId={projectId} />,
    },
    {
      label: t("project.tabs.board"),
      value: "board",
      content: (
        <BoardContent
          sections={sections}
          setSelectCardId={(cardId: string) => openCard(cardId)}
          loading={loading}
          projectId={projectId}
          lastUpdatedCard={lastUpdatedCard}
          deletedCardId={deletedCardId}
          userRole={userRole}
          onSectionsChange={setSections}
          onCardCreated={(card) =>
            setTimelineTasks((prev) => [...prev, mapCardsToTasks([card])[0]])
          }
        />
      ),
    },
    ...(!isMobile
      ? [
          {
            label: t("project.tabs.timeline"),
            value: "timeline",
            content: (
              <TimelineContent
                setSelectCardId={(cardId: string) => openCard(cardId)}
                sections={sections}
                tasks={timelineTasks}
                setTasks={setTimelineTasks}
                loading={loading}
              />
            ),
          },
        ]
      : []),
  ];

  const selectedTabIndex = tabsConfig.findIndex(
    (tab) => tab.value === activeTabValue,
  );

  // Clear tab-switching loading state as soon as the URL reflects the new tab
  useEffect(() => {
    setTabSwitching(false);
  }, [activeTabValue]);

  const handleTabChange = (newValue: string) => {
    if (newValue !== activeTabValue) setTabSwitching(true);
    router.push(`?tab=${newValue}`);
  };

  return (
    <GenericPage sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <GenericTabs
          selectedTab={activeTabValue}
          handleChange={(_, value) => handleTabChange(value as string)}
          tabsList={tabsConfig}
          scrollable
        />
        {["SuperAdmin", "Admin", "Leader"].includes(userRole) && (
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", ml: 1, flexShrink: 0 }}>
            {isMobile ? (
              <Tooltip title={t("project.settings")}>
                <IconButton size="small" onClick={() => setSettingsOpen(true)}>
                  <GenericIcon icon="settings" />
                </IconButton>
              </Tooltip>
            ) : (
              <GenericButton
                startIcon="settings"
                label={t("project.settings")}
                variant={ButtonVariant.Outlined}
                size={GeneralSize.Small}
                onClick={() => setSettingsOpen(true)}
              />
            )}
          </Box>
        )}
      </Box>

      <Box sx={{ p: 2, flexGrow: 1 }}>
        {tabSwitching ? <GenericLoading fullPage /> : tabsConfig[selectedTabIndex]?.content}
      </Box>

      {cardStack.map((cardId, idx) => (
        <CardContent
          key={`${idx}-${cardId}`}
          id={cardId}
          sections={sections}
          onClose={closeTopCard}
          onSaved={(updatedCard) => {
            setLastUpdatedCard(updatedCard);
            setTimelineTasks((prev) =>
              prev.map((t) =>
                t.id === updatedCard.id ? mapCardsToTasks([updatedCard])[0] : t,
              ),
            );
          }}
          onDeleted={(cardId) => {
            setDeletedCardId(cardId);
            setTimelineTasks((prev) => prev.filter((t) => t.id !== cardId));
          }}
          userRole={userRole}
          projectMembers={projectMembers}
          projectId={projectId}
          onOpenCard={(id) => openCard(String(id))}
          extraZIndex={idx * 50}
        />
      ))}

      <ProjectSettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        projectId={projectId}
        projectTitle={projectTitle}
        projectDescription={projectDescription}
        sections={sections}
        onSectionsChange={setSections}
        userRole={userRole}
        currentUserId={session?.user?.id ? Number(session.user.id) : undefined}
        projectMembers={projectMembers}
        onMembersUpdate={setProjectMembers}
        onProjectDetailsSaved={(name, description) => {
          setProjectTitle(name);
          setProjectDescription(description);
        }}
      />
    </GenericPage>
  );
}
