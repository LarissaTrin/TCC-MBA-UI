import { Avatar } from "@mui/material";

import { GenericAvatarProps } from "@/common/model";
/**
 * Generic reusable Avatar component based on Material UI's Avatar.
 * * This component displays an avatar with the initials of a full name.
 * The background color is dynamically generated based on the name
 * to ensure consistency for the same name across the application.
 *
 * Props:
 * @param {string} fullName - The full name to be used for generating the avatar's initials and background color.
 * @param {number} [size=40] - Optional. The size (width and height) of the avatar in pixels. Default is 40.
 *
 * Example usage:
 * ```tsx
 * <GenericAvatar
 * fullName="John Doe"
 * size={50}
 * />
 * ```
 */
export function GenericAvatar({ fullName, size = 40 }: GenericAvatarProps) {
  function stringToColor(string: string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  }

  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name?.split(" ")?.[1]?.[0]}`,
    };
  }

  return (
    <Avatar {...stringAvatar(fullName)} sx={{ width: size, height: size }} />
  );
}
