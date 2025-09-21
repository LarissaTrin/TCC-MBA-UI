import { Box, Modal, Typography } from "@mui/material";
import { GenericModalProps, GenericPanelProps } from "@/common/model";

/**
 * GenericModal - A reusable and flexible modal component built on top of Material UI's Modal.
 *
 * This component provides a standardized way to display modal dialogs with an optional title
 * and customizable content.
 *
 * @param {string} [title]
 *   Optional title to be displayed at the top of the modal.
 *
 * @param {boolean} open
 *   Controls whether the modal is visible or not.
 *
 * @param {() => void} handleClose
 *   Callback function triggered when the modal requests to be closed
 *   (e.g., by clicking outside or pressing the ESC key).
 *
 * @param {React.ReactNode} children
 *   The content to be rendered inside the modal.
 *
 * @example
 * <GenericModal
 *   title="User Info"
 *   open={isOpen}
 *   handleClose={() => setIsOpen(false)}
 * >
 *   <div>User details go here...</div>
 * </GenericModal>
 *
 * @remarks
 * - If a `title` is provided, it will be rendered using Material UI's Typography with `h6` variant.
 * - Accessibility attributes (`aria-labelledby`, `aria-describedby`) are automatically set.
 */
function GenericPanel({ id, children }: GenericPanelProps) {
  return (
    <Box sx={{ border: "1px solid", borderRadius: 2, p: 2 }}>{children}</Box>
  );
}

export default GenericPanel;
