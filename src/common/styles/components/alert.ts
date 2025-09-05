import { SnackbarOrigin } from "@mui/material";

import { AlertPosition } from "@/common/enum";

export const alertPositionMap: Record<AlertPosition, SnackbarOrigin> = {
  [AlertPosition.TopLeft]: { vertical: "top", horizontal: "left" },
  [AlertPosition.TopCenter]: { vertical: "top", horizontal: "center" },
  [AlertPosition.TopRight]: { vertical: "top", horizontal: "right" },
  [AlertPosition.BottomLeft]: { vertical: "bottom", horizontal: "left" },
  [AlertPosition.BottomCenter]: { vertical: "bottom", horizontal: "center" },
  [AlertPosition.BottomRight]: { vertical: "bottom", horizontal: "right" },
};
