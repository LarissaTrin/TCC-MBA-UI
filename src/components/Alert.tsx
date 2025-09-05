import { AlertPosition, SeverityColor } from "@/common/enum";
import { GenericAlertProps } from "@/common/model";
import { alertPositionMap } from "@/common/styles";
import { Alert, Snackbar } from "@mui/material";

/**
 * Generic reusable Alert component based on Material UI's Snackbar + Alert.
 *
 * This component displays a Snackbar containing an Alert with configurable
 * severity, content, and position. It uses strongly-typed enums for
 * severity (`SeverityColor`) and position (`AlertPosition`) for consistency
 * across the project.
 *
 * Props:
 * @param open - Whether the Snackbar is visible.
 * @param content - Text content displayed inside the Alert.
 * @param anchorOrigin - Optional. Position of the Snackbar. Uses the `AlertPosition` enum.
 *                       Default: `AlertPosition.TopRight`.
 *                       Possible values:
 *                       - TopLeft
 *                       - TopCenter
 *                       - TopRight
 *                       - BottomLeft
 *                       - BottomCenter
 *                       - BottomRight
 * @param severity - Optional. Severity level of the Alert. Uses the `SeverityColor` enum.
 *                   Default: `SeverityColor.Success`.
 *                   Possible values: Success, Info, Warning, Error.
 * @param handleClose - Function called when the Snackbar is closed. Receives
 *                      the event and the reason (`SnackbarCloseReason`) as parameters.
 *
 * Example usage:
 * ```tsx
 * <GenericAlert
 *   open={true}
 *   content="Operation successful"
 *   anchorOrigin={AlertPosition.TopRight}
 *   severity={SeverityColor.Success}
 *   handleClose={(event, reason) => console.log(reason)}
 * />
 * ```
 */
function GenericAlert({
  open,
  content,
  anchorOrigin = AlertPosition.TopRight,
  severity = SeverityColor.Success,
  handleClose,
}: GenericAlertProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={alertPositionMap[anchorOrigin]}
    >
      <Alert severity={severity}>{content}</Alert>
    </Snackbar>
  );
}

export default GenericAlert;
