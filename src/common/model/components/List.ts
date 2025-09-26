import { MaterialSymbol } from "material-symbols";

/**
 * Props for the `GenericList` component.
 */
export interface GenericListProps {
  /**
   * Collection of items to be rendered in the list.
   */
  items: GenericListItem[];

  /**
   * Displays a loading indicator at the top of the list.
   * @default false
   */
  loading?: boolean;

  /** If true, hides item labels and shows only icons (collapsed mode) */
  collapsed?: boolean;
}

/**
 * Represents a single item in the `GenericList`.
 */
export interface GenericListItem {
  /**
   * Text displayed as the item label.
   */
  label: string;

  /**
   * Optional icon displayed next to the label.
   * Must be a `MaterialSymbol` name.
   */
  icon?: MaterialSymbol;

  /**
   * Optional navigation link.
   * If provided, the item will be rendered as an anchor element.
   */
  href?: string;

  /**
   * Callback triggered when the item is clicked.
   * Ignored if `href` is defined.
   */
  onClick?: () => void;

  /**
   * If true, renders a `Divider` above the item.
   */
  dividerAbove?: boolean;

  /**
   * If true, renders a `Divider` below the item.
   */
  dividerBelow?: boolean;
}
