"use client";

import { useEffect, useState } from "react";
import { Comments } from "@/common/model";
import { commentService } from "@/common/services";
import { GeneralSize, ButtonVariant } from "@/common/enum";
import { GenericButton, GenericIcon } from "@/components/widgets";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import dayjs from "dayjs";

interface CardCommentsSectionProps {
  cardId: number;
  initialComments: Comments[];
}

export function CardCommentsSection({
  cardId,
  initialComments,
}: CardCommentsSectionProps) {
  const [comments, setComments] = useState<Comments[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleAdd = async () => {
    if (!newComment.trim()) return;

    // Optimistic update
    const optimistic: Comments = {
      id: Date.now(),
      description: newComment.trim(),
      user: { id: 1, firstName: "Current", lastName: "User", email: "" },
      createdAt: dayjs(),
      updatedAt: dayjs(),
    };
    setComments((prev) => [...prev, optimistic]);
    setNewComment("");

    try {
      const created = await commentService.create(cardId, optimistic.description);
      setComments((prev) =>
        prev.map((c) => (c.id === optimistic.id ? created : c))
      );
    } catch {
      // Rollback on failure
      setComments((prev) => prev.filter((c) => c.id !== optimistic.id));
    }
  };

  const handleStartEdit = (comment: Comments) => {
    setEditingId(comment.id);
    setEditingText(comment.description);
  };

  const handleSaveEdit = async (commentId: number) => {
    const previous = comments.find((c) => c.id === commentId);
    if (!previous) return;

    // Optimistic update
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, description: editingText, updatedAt: dayjs() }
          : c
      )
    );
    setEditingId(null);
    setEditingText("");

    try {
      await commentService.update(commentId, editingText);
    } catch {
      // Rollback on failure
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? previous : c))
      );
    }
  };

  const handleDelete = async (commentId: number) => {
    const previous = comments.find((c) => c.id === commentId);
    if (!previous) return;

    // Optimistic update
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    if (editingId === commentId) {
      setEditingId(null);
      setEditingText("");
    }

    try {
      await commentService.delete(commentId);
    } catch {
      // Rollback on failure
      setComments((prev) => [...prev, previous]);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
        Comments
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          size="small"
          placeholder="Write a comment..."
          multiline
          minRows={2}
          maxRows={4}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{ flex: 1 }}
        />
        <GenericButton
          label="Add"
          size={GeneralSize.Small}
          variant={ButtonVariant.Outlined}
          onClick={handleAdd}
          disabled={!newComment.trim()}
        />
      </Box>

      {comments.map((comment) => (
        <Box
          key={comment.id}
          sx={{
            mb: 1.5,
            p: 1.5,
            borderRadius: 1,
            bgcolor: "grey.50",
            border: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 0.5,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {comment.user.firstName} {comment.user.lastName}
              {comment.createdAt &&
                ` — ${dayjs(comment.createdAt).format("DD/MM/YYYY HH:mm")}`}
            </Typography>
            <Box>
              {editingId === comment.id ? (
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleSaveEdit(comment.id)}
                >
                  <GenericIcon icon="check" size={18} />
                </IconButton>
              ) : (
                <IconButton
                  size="small"
                  onClick={() => handleStartEdit(comment)}
                >
                  <GenericIcon icon="edit" size={18} />
                </IconButton>
              )}
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(comment.id)}
              >
                <GenericIcon icon="delete" size={18} />
              </IconButton>
            </Box>
          </Box>

          {editingId === comment.id ? (
            <TextField
              size="small"
              fullWidth
              multiline
              minRows={2}
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
            />
          ) : (
            <Typography variant="body2">{comment.description}</Typography>
          )}
        </Box>
      ))}

      {comments.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No comments yet.
        </Typography>
      )}
    </Box>
  );
}
