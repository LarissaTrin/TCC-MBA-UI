import { Tab, Tabs } from "@mui/material";
import { GenericTabsProps } from "@/common/model";

/**
 * Generic and reusable tabs component based on Material UI's Tabs.
 *
 * This component renders a tab navigation with dynamic items.
 * It uses standardized props to ensure consistent use across the application.
 *
 * @param {number} selectedTab - The index of the currently selected tab.
 * @param {(event: React.SyntheticEvent, newValue: number) => void} handleChange - Callback fired when a different tab is selected.
 * @param {"horizontal" | "vertical"} [orientation="horizontal"] - The orientation of the tabs.
 * @param {GenericTabItem[]} tabsList - The list of tabs to be rendered, each with a label and value.
 */
function GenericTabs({
  selectedTab,
  orientation = "horizontal",
  tabsList,
  handleChange,
}: GenericTabsProps) {
  return (
    <Tabs
      orientation={orientation}
      value={selectedTab}
      onChange={handleChange}
      aria-label="generic tabs"
    >
      {tabsList.map((tab) => (
        <Tab key={tab.value} label={tab.label} value={tab.value} />
      ))}
    </Tabs>
  );
}

export default GenericTabs;
