"use client";

import React from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import { Box, Card, CardContent, Chip, Typography, Avatar } from "@mui/material";

export interface TaskProps {
  id: string;
  title: string;
  columnId: string;
  index: number;
  priority?: number;
  onClick?: () => void;
  tags?: { id: number; name: string }[];
  userDisplay?: string;
  taskTotal?: number;
  taskCompleted?: number;
  blocked?: boolean;
}

export function Task({
  id,
  title,
  columnId,
  index,
  onClick,
  tags = [],
  userDisplay,
  taskTotal = 0,
  taskCompleted = 0,
  blocked = false,
}: TaskProps) {
  const { ref, isDragging } = useSortable({
    id,
    index,
    group: columnId,
    type: "item",
    accept: ["item"],
  });

  const visibleTags = tags.slice(0, 3);
  const extraTagCount = tags.length - 3;

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1, cursor: "grab", marginBottom: "10px" }}>
      <Card
        onClick={onClick}
        sx={{
          cursor: "pointer",
          "&:hover": { boxShadow: 4 },
          transition: "box-shadow 0.2s",
          ...(blocked && {
            borderLeft: "3px solid",
            borderColor: "error.main",
          }),
        }}
      >
        <CardContent sx={{ p: "12px !important" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="caption" color="text.disabled">
              #{id}
            </Typography>
            {blocked && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography variant="caption" color="error" sx={{ fontWeight: 600, fontSize: "0.65rem" }}>
                  Blocked
                </Typography>
              </Box>
            )}
          </Box>

          <Typography variant="body2" fontWeight={500} sx={{ mb: 1, lineHeight: 1.4 }}>
            {title}
          </Typography>

          {tags.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
              {visibleTags.map((tag) => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  size="small"
                  sx={{ height: 20, fontSize: "0.7rem" }}
                />
              ))}
              {extraTagCount > 0 && (
                <Chip
                  label={`+${extraTagCount}`}
                  size="small"
                  variant="outlined"
                  sx={{ height: 20, fontSize: "0.7rem" }}
                />
              )}
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 0.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0 }}>
              <Avatar
                sx={{
                  width: 20,
                  height: 20,
                  fontSize: "0.6rem",
                  bgcolor: userDisplay ? "primary.main" : "action.disabled",
                  flexShrink: 0,
                }}
              >
                {userDisplay ? userDisplay.charAt(0).toUpperCase() : "?"}
              </Avatar>
              <Typography
                variant="caption"
                color={userDisplay ? "text.secondary" : "text.disabled"}
                noWrap
                sx={{ maxWidth: 110 }}
              >
                {userDisplay ?? "No user"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
              <span className="material-icons" style={{ fontSize: 14, opacity: 0.6 }}>
                check_box
              </span>
              <Typography variant="caption" color="text.secondary">
                {taskCompleted}/{taskTotal}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

export function StaticTask({ title }: { title: string }) {
  return (
    <Card
      style={{
        cursor: "grabbing",
        boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
      }}
    >
      <CardContent sx={{ p: "12px !important" }}>
        <Typography variant="body2" fontWeight={500}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}
