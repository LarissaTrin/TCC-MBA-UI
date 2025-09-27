import { Badge } from "@mui/material";

import { GenericBadgeProps } from "@/common/model";
import { GeneralColor } from "@/common/enum";

/**
 * Generic and reusable badge component based on Material UI's Badge.
 *
 * This component displays a count indicator or a dot on top of its child component,
 * using standardized colors and variants to maintain visual consistency.
 *
 * Props:
 * @param {number} count - The number to be displayed in the badge. If the variant is 'dot', this value is not shown but is still required.
 * @param {GeneralColor} [color='primary'] - The color of the badge. Uses the GeneralColor enum. Defaults to 'primary'.
 * @param {'standard' | 'dot'} [variant='standard'] - The style of the badge. Can be 'standard' (displays the count) or 'dot' (displays a single point). Defaults to 'standard'.
 * @param {React.ReactNode} children - The child component that the badge will wrap.
 *
 * Example usage:
 * ```tsx
 * <GenericBadge count={5} color={GeneralColor.Success} variant="standard">
 * <ShoppingCartIcon />
 * </GenericBadge>
 * ```
 */
export function GenericBadge({
  count = 0,
  color = GeneralColor.Primary,
  variant = "standard",
  children,
}: GenericBadgeProps) {
  return (
    <Badge color={color} badgeContent={count} variant={variant}>
      {children}
    </Badge>
  );
}
