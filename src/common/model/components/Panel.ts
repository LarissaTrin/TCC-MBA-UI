import { PropsWithChildren } from "react";

/**
 * Props for the GenericModal component.
 */
export interface GenericPanelProps extends PropsWithChildren {
  /**
   * Optional title to be displayed at the top of the modal.
   */
  id?: string;
}
