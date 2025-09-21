import { PropsWithChildren } from "react";

/**
 * Props for the GenericModal component.
 */
export interface GenericModalProps extends PropsWithChildren {
  /**
   * Optional title to be displayed at the top of the modal.
   */
  title?: string;

  /**
   * Controls whether the modal is visible or not.
   */
  open: boolean;

  /**
   * Callback function triggered when the modal requests to be closed
   * (e.g., by clicking the backdrop or pressing the ESC key).
   */
  handleClose: () => void;
}
