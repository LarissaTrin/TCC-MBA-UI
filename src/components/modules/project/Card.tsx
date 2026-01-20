"use client";

import { GenericDrawer, GenericTextField } from "@/components/widgets";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";

interface CardContentProps {
  id?: string;
  onClose: () => void;
}

export function CardContent({ id, onClose }: CardContentProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [value, setValue] = useState("");

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
      <Box sx={{ padding: 2, minWidth: 400, gap: 2, display: "flex", flexDirection: "column" }}>
        <Box>Testeeeeee111111111111111111111</Box>
        <GenericTextField name={id ?? ""} label={"Description"} value={value} onChange={setValue}/>
      </Box>
    </GenericDrawer>
  );
}
