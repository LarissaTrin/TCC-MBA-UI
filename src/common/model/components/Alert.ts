import { AlertPosition, SeverityColor } from "@/common/enum";
import { SnackbarCloseReason } from "@mui/material";
import { SyntheticEvent } from "react";

export interface GenericAlertProps {
  /**
   * Whether the Snackbar is visible.
   *
   * @default false
   */
  open: boolean;

  /**
   * Text content displayed inside the Alert.
   */
  content: string;

  /**
   * Position of the Snackbar. Uses the AlertPosition enum.
   *
   * Possible values:
   * - TopLeft
   * - TopCenter
   * - TopRight (default)
   * - BottomLeft
   * - BottomCenter
   * - BottomRight
   *
   * @default AlertPosition.TopRight
   */
  anchorOrigin: AlertPosition;

  /**
   * Severity level of the Alert. Uses the SeverityColor enum.
   *
   * Possible values:
   * - Success (default)
   * - Info
   * - Warning
   * - Error
   *
   * @default SeverityColor.Success
   */
  severity?: SeverityColor;

  /**
   * Function called when the Snackbar is closed.
   *
   * Receives two arguments:
   * - event: the triggering event (MouseEvent, KeyboardEvent, or SyntheticEvent)
   * - reason: the reason for closing (SnackbarCloseReason)
   */
  handleClose: (
    event: Event | SyntheticEvent,
    reason: SnackbarCloseReason
  ) => void;
}
