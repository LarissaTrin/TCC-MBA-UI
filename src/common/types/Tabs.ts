export interface GenericTabsProps {
  /**
   * The index of the currently selected tab.
   */
  selectedTab: number | string;

  /**
   * Callback fired when a different tab is selected.
   * @param event - The event source of the callback.
   * @param newValue - The index of the newly selected tab.
   */
  handleChange: (
    event: React.SyntheticEvent,
    newValue: string | number
  ) => void;

  /**
   * The orientation of the tabs.
   * @default "horizontal"
   */
  orientation?: "vertical" | "horizontal";

  /**
   * Enable horizontal scroll for overflowing tabs (useful on mobile).
   * @default false
   */
  scrollable?: boolean;

  /**
   * The list of tabs to render, each with a label and unique value.
   */
  tabsList: GenericTabItem[];
}

/**
 * Model that represents a single tab in the GenericTabs component.
 */
export interface GenericTabItem {
  /**
   * The label text displayed on the tab.
   */
  label: string;

  /**
   * The unique value (index or identifier) for the tab.
   */
  value: number | string;
}
