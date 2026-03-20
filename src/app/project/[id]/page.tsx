"use client";

import { useEffect, useState } from "react";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { GenericTabs, GenericLoading } from "@/components";
import { GenericPage } from "@/components/widgets/Page";
import { Box } from "@mui/material";
import { DashboardContent } from "@/components/modules/project/dashboard/Dashboard";
import { BoardContent } from "@/components/modules/project/board/Board";
import { TimelineContent } from "@/components/modules/project/timeline/Timeline";
import { CardContent } from "@/components/modules/project/card/Card";
import { BoardFilters } from "@/components/modules/project/board/BoardFilters";
import { useBoardFilters } from "@/components/modules/project/board/useBoardFilters";
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

  const [cardStack, setCardStack] = useState<string[]>([]);
  const openCard = (id: string) => setCardStack((prev) => [...prev, id]);
  const closeTopCard = () => setCardStack((prev) => prev.slice(0, -1));
  const [sections, setSections] = useState<Section[]>([]);
  const [rawCards, setRawCards] = useState<Card[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
  const [userRole, setUserRole] = useState<string>("User");
  const [projectTitle, setProjectTitle] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");

  useEffect(() => {
    if (!projectId) return;
    withLoading(() => sectionService.getListsWithCards(projectId)).then(
      ({ sections: secs, cards }) => {
        const orderedSections = [...secs].sort((a, b) => a.order - b.order);
        setSections(orderedSections);
        setRawCards(cards);
        setTasks(mapCardsToTasks(cards));
        setLoading(false);
      },
    );
  }, [projectId, withLoading]);

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

  const {
    form: filterForm,
    filteredTasks,
    isFiltered,
    resetFilters,
    handleApply,
    tagOptions,
    memberSearch,
  } = useBoardFilters(tasks, projectId);

  const activeTabValue = searchParams.get("tab") || "dashboard";
  const showFilters = activeTabValue === "board" || activeTabValue === "timeline";

  const tabsConfig = [
    {
      label: "Dashboard",
      value: "dashboard",
      content: <DashboardContent projectId={projectId} />,
    },
    {
      label: "Board",
      value: "board",
      content: (
        <BoardContent
          sections={sections}
          setSelectCardId={(cardId: string) => openCard(cardId)}
          tasks={filteredTasks}
          loading={loading}
          onCardCreated={(card) => setTasks((prev) => [...prev, ...mapCardsToTasks([card])])}
        />
      ),
    },
    {
      label: "Timeline",
      value: "timeline",
      content: (
        <TimelineContent
          setSelectCardId={(cardId: string) => openCard(cardId)}
          sections={sections}
          tasks={filteredTasks}
          setTasks={setTasks}
          loading={loading}
        />
      ),
    },
  ];

  const selectedTabIndex = tabsConfig.findIndex(
    (tab) => tab.value === activeTabValue,
  );

  const handleTabChange = (newValue: string) => {
    router.push(`?tab=${newValue}`);
  };

  if (loading) {
    return <GenericLoading fullPage />;
  }

  return (
    <GenericPage sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <GenericTabs
          selectedTab={activeTabValue}
          handleChange={(_, value) => handleTabChange(value as string)}
          tabsList={tabsConfig}
        />
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {showFilters && (
            <BoardFilters
              form={filterForm}
              tagOptions={tagOptions}
              memberSearch={memberSearch}
              isFiltered={isFiltered}
              onApply={handleApply}
              onClear={resetFilters}
            />
          )}
          <GenericButton
            startIcon="settings"
            label={t("project.settings")}
            variant={ButtonVariant.Outlined}
            size={GeneralSize.Small}
            onClick={() => setSettingsOpen(true)}
          />
        </Box>
      </Box>

      <Box sx={{ p: 2, flexGrow: 1 }}>
        {tabsConfig[selectedTabIndex]?.content}
      </Box>
      {cardStack.map((cardId, idx) => (
        <CardContent
          key={`${idx}-${cardId}`}
          id={cardId}
          sections={sections}
          onClose={closeTopCard}
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
        projectMembers={projectMembers}
        onMembersUpdate={setProjectMembers}
      />
    </GenericPage>
  );
}
