"use client";

import { GenericDrawer } from "@/components/widgets";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";

interface CardContentProps {
  id?: string;
  onClose: () => void;
}

export function CardContent({ id, onClose }: CardContentProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleClose = () => {
    setIsDrawerOpen(false);
    onClose();
  };

  useEffect(() => {
    if (!id) return;
    console.log(id);
    setIsDrawerOpen(true);
  }, [id]);

  return (
    <GenericDrawer
      open={isDrawerOpen}
      onClose={handleClose}
      anchor="right"
      sx={{ zIndex: 1501 }}
    >
      <Box>Testeeeeee</Box>
    </GenericDrawer>
  );
}
