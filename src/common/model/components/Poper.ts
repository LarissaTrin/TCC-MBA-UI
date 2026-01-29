export interface GenericPoperProps {
  open: boolean;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  onClose: (event: MouseEvent | TouchEvent) => void;
  children?: React.ReactNode;
}
