import { Box, Modal, Typography } from "@mui/material";
import { GenericModalProps } from "@/common/model";

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
function GenericModal({
  title,
  open,
  handleClose,
  children,
}: GenericModalProps) {

  const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {title && (
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {title}
          </Typography>
        )}
        {children}
      </Box>
    </Modal>
  );
}

export default GenericModal;
