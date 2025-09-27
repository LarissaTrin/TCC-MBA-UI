/**
 * Props for the GenericTextField component.
 */
export interface GenericSidebarProps {
  /** The id of the input element */
  id?: string;
  open: boolean;
  variant: "permanent" | "temporary";
  onClose: () => void;
}
