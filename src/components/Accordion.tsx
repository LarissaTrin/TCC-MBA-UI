import { useState, ReactNode, useEffect } from "react";
import { Box, Collapse, Typography, useTheme } from "@mui/material";
import { GenericIcon } from "./Icon";

export type Orientation = "vertical" | "horizontal";

export interface GenericAccordionProps {
  /** Orientation of the accordion (vertical or horizontal) */
  orientation?: Orientation;
  /** Header (trigger) content */
  header: ReactNode;
  /** Collapsible content */
  children: ReactNode;
  /** Optional: start expanded */
  defaultExpanded?: boolean;
  /** Height when orientation is horizontal (default: auto) */
  height?: number | string;
  /** Width when expanded in horizontal mode (default: 240) */
  expandedWidth?: number;
  /** Width when collapsed in horizontal mode (default: 64) */
  collapsedWidth?: number;
  /** Disable collapsing (always expanded, no icon) */
  disableCollapse?: boolean;
}

export default function GenericAccordion({
  orientation = "vertical",
  header,
  children,
  defaultExpanded = false,
  height = "auto",
  expandedWidth = 240,
  collapsedWidth = 64,
  disableCollapse = false,
}: GenericAccordionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded || disableCollapse);
  const theme = useTheme();

  const isHorizontal = orientation === "horizontal";

  // Se disableCollapse mudar, força sempre expanded
  useEffect(() => {
    if (disableCollapse) {
      setExpanded(true);
    }
  }, [disableCollapse]);

  const toggleAccordion = () => {
    if (!disableCollapse) {
      setExpanded((prev) => !prev);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      border={`1px solid ${theme.palette.divider}`}
      borderRadius={2}
      overflow="hidden"
      width={
        isHorizontal ? (expanded ? expandedWidth : collapsedWidth) : "100%"
      }
      height={isHorizontal ? height : "auto"}
    >
      {/* HEADER */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={2}
        sx={{
          cursor: disableCollapse ? "default" : "pointer",
          bgcolor: theme.palette.action.hover,
          flexDirection: isHorizontal && !expanded ? "column" : "row",
          height: !expanded && isHorizontal ? height : "auto",
        }}
        onClick={toggleAccordion}
      >
        {isHorizontal && !expanded && !disableCollapse && (
          <GenericIcon icon="arrow_forward_ios" />
        )}

        <Box
          flex={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography
            variant="body1"
            sx={{
              transform: isHorizontal && !expanded ? "rotate(-90deg)" : "none",
              whiteSpace: "nowrap",
            }}
          >
            {header}
          </Typography>
        </Box>

        {!disableCollapse &&
          (isHorizontal ? (
            expanded ? <GenericIcon icon="arrow_forward_ios" /> : null
          ) : expanded ? (
            <GenericIcon icon="keyboard_arrow_up" />
          ) : (
            <GenericIcon icon="keyboard_arrow_down" />
          ))}
      </Box>

      {/* CONTENT */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box p={2}>{children}</Box>
      </Collapse>
    </Box>
  );
}
