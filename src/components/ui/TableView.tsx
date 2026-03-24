"use client";
import React, { useState, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Box,
  Checkbox,
  Chip,
  FormControlLabel,
  IconButton,
  Paper,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import { TableColDef } from "@/common/model";
import { TableColKey, TableSortDir } from "@/common/enum";
import { BoardCardProps } from "../widgets/BoardCard";
import { Section } from "@/common/model";
import { cardService } from "@/common/services";
import { useTranslation } from "@/common/provider";
import { GenericIcon } from "@/components/widgets";

type TableRow = BoardCardProps & { column: string; order: number };

interface TableViewProps {
  containers: Record<string, BoardCardProps[]>;
  setContainers: React.Dispatch<React.SetStateAction<Record<string, BoardCardProps[]>>>;
  sections: Section[];
  onCardClick?: (id: string) => void;
}

const COLUMNS: TableColDef[] = [
  { key: "order",      labelKey: "table.order",      sortable: false, defaultVisible: true,  width: 50  },
  { key: "cardNumber", labelKey: "table.cardNumber",  sortable: true,  defaultVisible: false, width: 70  },
  { key: "title",      labelKey: "table.title",       sortable: true,  defaultVisible: true              },
  { key: "list",       labelKey: "table.list",        sortable: true,  defaultVisible: true              },
  { key: "priority",   labelKey: "table.priority",    sortable: true,  defaultVisible: true,  width: 100 },
  { key: "category",   labelKey: "table.category",    sortable: true,  defaultVisible: false             },
  { key: "assignee",   labelKey: "table.assignee",    sortable: true,  defaultVisible: false             },
  { key: "tasks",      labelKey: "table.tasks",       sortable: true,  defaultVisible: false, width: 90  },
  { key: "blocked",    labelKey: "table.blocked",     sortable: true,  defaultVisible: false, width: 90  },
];

const STORAGE_KEY = "tableView_visibleCols";

function loadVisibleCols(): Record<TableColKey, boolean> {
  const defaults = Object.fromEntries(
    COLUMNS.map((c) => [c.key, c.defaultVisible])
  ) as Record<TableColKey, boolean>;
  try {
    const stored = typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
  } catch {
    return defaults;
  }
}

export function TableView({ containers, setContainers, sections, onCardClick }: TableViewProps) {
  const { t } = useTranslation();

  const [visibleCols, setVisibleCols] = useState<Record<TableColKey, boolean>>(loadVisibleCols);
  const [colsAnchorEl, setColsAnchorEl] = useState<HTMLElement | null>(null);

  const toggleCol = (key: TableColKey) => {
    setVisibleCols((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* noop */ }
      return next;
    });
  };

  const [sortKey, setSortKey] = useState<TableColKey | null>(null);
  const [sortDir, setSortDir] = useState<TableSortDir>("asc");

  const handleSort = (key: TableColKey) => {
    if (sortKey === key) {
      if (sortDir === "asc") {
        setSortDir("desc");
      } else {
        setSortKey(null);
        setSortDir("asc");
      }
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sectionMeta = useMemo(() => {
    const map: Record<string, { order: number; name: string }> = {};
    sections.forEach((s) => { map[s.id] = { order: s.order, name: s.name }; });
    return map;
  }, [sections]);

  const allTasks: TableRow[] = useMemo(() => {
    return Object.entries(containers)
      .flatMap(([column, tasks]) =>
        tasks.filter(Boolean).map((task, index) => ({ ...task, column, order: task.index ?? index }))
      )
      .sort((a, b) => {
        const hasA = a.sortOrder != null;
        const hasB = b.sortOrder != null;
        if (hasA && hasB) return a.sortOrder! - b.sortOrder!;
        if (hasA) return -1;
        if (hasB) return 1;
        const listOrderA = sectionMeta[a.column]?.order ?? 0;
        const listOrderB = sectionMeta[b.column]?.order ?? 0;
        if (listOrderA !== listOrderB) return listOrderA - listOrderB;
        return a.order - b.order;
      });
  }, [containers, sectionMeta]);

  const displayTasks: TableRow[] = useMemo(() => {
    if (!sortKey || sortKey === "order") return allTasks;
    return [...allTasks].sort((a, b) => {
      let va: string | number = "";
      let vb: string | number = "";
      switch (sortKey) {
        case "cardNumber": va = Number(a.cardNumber);                           vb = Number(b.cardNumber);                           break;
        case "title":      va = a.title.toLowerCase();                          vb = b.title.toLowerCase();                          break;
        case "list":       va = sectionMeta[a.column]?.name?.toLowerCase() ?? ""; vb = sectionMeta[b.column]?.name?.toLowerCase() ?? ""; break;
        case "priority":   va = a.priority ?? 9999;                             vb = b.priority ?? 9999;                             break;
        case "category":   va = a.category?.name?.toLowerCase() ?? "";          vb = b.category?.name?.toLowerCase() ?? "";          break;
        case "assignee":   va = a.userDisplay?.toLowerCase() ?? "";             vb = b.userDisplay?.toLowerCase() ?? "";             break;
        case "tasks":      va = a.taskCompleted ?? 0;                           vb = b.taskCompleted ?? 0;                           break;
        case "blocked":    va = a.blocked ? 1 : 0;                              vb = b.blocked ? 1 : 0;                              break;
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [allTasks, sortKey, sortDir, sectionMeta]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = displayTasks.findIndex((t) => t.id === active.id);
    const newIndex = displayTasks.findIndex((t) => t.id === over.id);
    const reordered = arrayMove(displayTasks, oldIndex, newIndex).map(
      (t, idx) => ({ ...t, order: idx + 1, sortOrder: idx + 1 })
    );

    const updatedContainers: Record<string, BoardCardProps[]> = {};
    Object.keys(containers).forEach((key) => {
      updatedContainers[key] = reordered
        .filter((t) => containers[key].some((ct) => ct?.id === t?.id))
        .map(({ column: _col, ...rest }) => rest);
    });
    setContainers(updatedContainers);

    try {
      await cardService.reorder(
        reordered.map((t) => ({ cardId: Number(t.id), sortOrder: t.sortOrder }))
      );
    } catch (error) {
      console.error("Failed to save order:", error);
    }
  }

  const visibleColDefs = COLUMNS.filter((c) => visibleCols[c.key]);
  const sortActive = sortKey !== null && sortKey !== "order";

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <Tooltip title={t("table.columns")}>
          <IconButton size="small" onClick={(e) => setColsAnchorEl(e.currentTarget)}>
            <GenericIcon icon="view_column" />
          </IconButton>
        </Tooltip>
      </Box>

      <Popover
        open={Boolean(colsAnchorEl)}
        anchorEl={colsAnchorEl}
        onClose={() => setColsAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="subtitle2" mb={1}>
            {t("table.columns")}
          </Typography>
          {COLUMNS.filter((c) => c.key !== "order").map((col) => (
            <FormControlLabel
              key={col.key}
              control={
                <Checkbox
                  size="small"
                  checked={visibleCols[col.key]}
                  onChange={() => toggleCol(col.key)}
                />
              }
              label={t(col.labelKey)}
              sx={{ display: "flex", mx: 0 }}
            />
          ))}
        </Box>
      </Popover>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={displayTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {visibleColDefs.map((col) => (
                  <TableCell key={col.key} sx={{ width: col.width }}>
                    {col.sortable ? (
                      <TableSortLabel
                        active={sortKey === col.key}
                        direction={sortKey === col.key ? sortDir : "asc"}
                        onClick={() => handleSort(col.key)}
                      >
                        {t(col.labelKey)}
                      </TableSortLabel>
                    ) : (
                      t(col.labelKey)
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayTasks.map((task, index) => (
                <SortableTableRow
                  key={task.id}
                  task={task}
                  globalIndex={index + 1}
                  sectionName={sectionMeta[task.column]?.name ?? task.column}
                  visibleColDefs={visibleColDefs}
                  sortActive={sortActive}
                  onCardClick={onCardClick}
                  noPriorityLabel={t("table.noPriority")}
                />
              ))}
            </TableBody>
          </Table>
        </SortableContext>
      </DndContext>
    </Paper>
  );
}

function SortableTableRow({
  task,
  globalIndex,
  sectionName,
  visibleColDefs,
  sortActive,
  onCardClick,
  noPriorityLabel,
}: {
  task: TableRow;
  globalIndex: number;
  sectionName: string;
  visibleColDefs: TableColDef[];
  sortActive: boolean;
  onCardClick?: (id: string) => void;
  noPriorityLabel: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: sortActive ? ("default" as const) : ("grab" as const),
    opacity: isDragging ? 0.5 : 1,
  };

  function renderCell(col: TableColDef) {
    switch (col.key) {
      case "order":
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: sortActive ? "default" : "grab", color: sortActive ? "text.disabled" : "text.secondary" }}>
            <GenericIcon icon="drag_indicator" sx={{ fontSize: 16, opacity: sortActive ? 0.3 : 0.7 }} />
            <Typography variant="caption">{globalIndex}</Typography>
          </Box>
        );
      case "cardNumber":
        return <Typography variant="caption" color="text.disabled">#{task.cardNumber}</Typography>;
      case "title":
        return <Typography noWrap>{task.title}</Typography>;
      case "list":
        return <Typography variant="body2">{sectionName}</Typography>;
      case "priority":
        return <Typography variant="body2">{task.priority != null ? task.priority : noPriorityLabel}</Typography>;
      case "category":
        return task.category ? (
          <Chip label={task.category.name} size="small" sx={{ height: 20, fontSize: "0.7rem" }} />
        ) : (
          <Typography variant="caption" color="text.disabled">—</Typography>
        );
      case "assignee":
        return <Typography variant="body2" noWrap>{task.userDisplay ?? "—"}</Typography>;
      case "tasks":
        return <Typography variant="body2">{task.taskCompleted ?? 0}/{task.taskTotal ?? 0}</Typography>;
      case "blocked":
        return task.blocked ? (
          <Chip label="●" size="small" color="error" sx={{ height: 20, minWidth: 0, fontSize: "0.6rem" }} />
        ) : (
          <Typography variant="caption" color="text.disabled">—</Typography>
        );
    }
  }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(sortActive ? {} : listeners)}
      onClick={() => !isDragging && onCardClick?.(String(task.id))}
      sx={{ "&:hover": { bgcolor: "action.hover" } }}
    >
      {visibleColDefs.map((col) => (
        <TableCell key={col.key}>{renderCell(col)}</TableCell>
      ))}
    </TableRow>
  );
}
