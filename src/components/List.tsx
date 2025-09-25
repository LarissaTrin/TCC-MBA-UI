import { GenericListProps } from "@/common/model";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { GenericIcon } from "./Icon";
import GenericLoading from "./Loading";

/**
 * Generic and reusable list component based on Material UI's List.
 *
 * This component renders a list of items with optional icons, dividers, and links.
 * It supports loading states and customizable click callbacks.
 *
 * @component
 * @example
 * const items = [
 *   { label: "Inbox", icon: "inbox", onClick: () => console.log("Inbox clicked") },
 *   { label: "Drafts", icon: "drafts", dividerBelow: true },
 *   { label: "Trash", href: "/trash" },
 *   { label: "Spam", dividerAbove: true, href: "/spam" }
 * ];
 *
 * return <GenericList items={items} loading={false} />;
 *
 * @param {GenericListProps} props - The props for the component.
 * @param {GenericListItem[]} props.items - The list of items to render.
 * @param {boolean} [props.loading=false] - If true, displays a loading indicator at the top of the list.
 */

function GenericList({ items, loading }: GenericListProps) {
  return (
    <List>
      {loading && (
        <ListItem>
          <GenericLoading />
        </ListItem>
      )}

      {items?.map((item, index) => (
        <div key={index}>
          {item.dividerAbove && <Divider />}

          <ListItem disablePadding>
            <ListItemButton
              component={item.href ? "a" : "button"}
              href={item.href}
              onClick={item.onClick}
            >
              {item.icon && (
                <ListItemIcon>
                  <GenericIcon icon={item.icon} />
                </ListItemIcon>
              )}
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>

          {item.dividerBelow && <Divider />}
        </div>
      ))}
    </List>
  );
}

export default GenericList;
