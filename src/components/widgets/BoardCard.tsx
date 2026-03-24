"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/react/sortable";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useTranslation } from "@/common/provider";
import { GeneralSize, ButtonVariant, GeneralColor } from "@/common/enum";
import { Category, Tag } from "@/common/model";
import { GenericButton, GenericIcon } from "./";

const CATEGORY_COLORS: Record<
  string,
  "error" | "success" | "warning" | "primary" | "info" | "secondary" | "default"
> = {
  Bug: "error",
  Feature: "success",
  Issue: "warning",
  Task: "primary",
  Enhancement: "info",
  Improvement: "secondary",
};

export interface BoardCardProps {
  id: string;
  cardNumber: string;
  title: string;
  columnId: string;
  index: number;
  priority?: number;
  onClick?: () => void;
  tags?: Tag[];
  userDisplay?: string;
  taskTotal?: number;
  taskCompleted?: number;
  blocked?: boolean;
  sortOrder?: number;
  category?: Category;
  canDelete?: boolean;
  onDelete?: () => void;
}

export function BoardCard({
  id,
  cardNumber,
  title,
  columnId,
  index,
  onClick,
  tags = [],
  userDisplay,
  taskTotal = 0,
  taskCompleted = 0,
  blocked = false,
  category,
  canDelete = false,
  onDelete,
}: BoardCardProps) {
  const { t } = useTranslation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { ref, isDragging } = useSortable({
    id,
    index,
    group: columnId,
    type: "item",
    accept: ["item"],
  });

  const visibleTags = tags.slice(0, 3);
  const extraTagCount = tags.length - 3;
  const categoryColor = category
    ? (CATEGORY_COLORS[category.name] ?? "default")
    : undefined;

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        marginBottom: "10px",
      }}
    >
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
          {/* Row 1: card number + delete */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 0.5,
            }}
          >
            <Typography variant="caption" color="text.disabled">
              #{cardNumber}
            </Typography>
            {canDelete && onDelete && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmOpen(true);
                }}
                sx={{
                  opacity: 0.4,
                  "&:hover": { opacity: 1, color: "error.main" },
                  p: 0.25,
                }}
              >
                <GenericIcon icon="delete" size={GeneralSize.Small} />
              </IconButton>
            )}
          </Box>

          {/* Row 2: category (left) + blocked (right) */}
          {(category || blocked) && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 0.75,
              }}
            >
              <Box>
                {category && (
                  <Chip
                    label={category.name}
                    size="small"
                    color={categoryColor}
                    sx={{ height: 18, fontSize: "0.65rem" }}
                  />
                )}
              </Box>
              <Box>
                {blocked && (
                  <Chip
                    label={t("card.blocked")}
                    size="small"
                    color="error"
                    variant="outlined"
                    sx={{ height: 18, fontSize: "0.65rem" }}
                  />
                )}
              </Box>
            </Box>
          )}

          {/* Title */}
          <Typography
            variant="body2"
            fontWeight={500}
            sx={{ mb: 1, lineHeight: 1.4 }}
          >
            {title}
          </Typography>

          {/* Tags */}
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

          {/* Footer: user avatar + task counter */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 0.5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                minWidth: 0,
              }}
            >
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
                {userDisplay ?? t("common.noUser")}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                flexShrink: 0,
              }}
            >
              <GenericIcon
                icon="check_box"
                size={GeneralSize.Small}
                sx={{ opacity: 0.6 }}
              />
              <Typography variant="caption" color="text.secondary">
                {taskCompleted}/{taskTotal}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>
          {t("card.confirmDeleteTitle").replace("{name}", title)}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{t("card.confirmDeleteText")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <GenericButton
            label={t("common.cancel")}
            variant={ButtonVariant.Text}
            onClick={() => setConfirmOpen(false)}
          />
          <GenericButton
            label={t("card.confirmDelete")}
            variant={ButtonVariant.Contained}
            color={GeneralColor.Error}
            // onClick={(e) => { setConfirmOpen(false); onDelete?.(e as React.MouseEvent); }}
            onClick={() => {
              setConfirmOpen(false);
              onDelete?.();
            }}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
}

export function StaticBoardCard({ title }: { title: string }) {
  return (
    <Card
      style={{ cursor: "grabbing", boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
    >
      <CardContent sx={{ p: "12px !important" }}>
        <Typography variant="body2" fontWeight={500}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}
