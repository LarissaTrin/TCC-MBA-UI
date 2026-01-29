import { SxProps, Theme } from "@mui/material"

export default function getSxProps(sxProps?: SxProps<Theme>) {
    if (sxProps) {
        return Array.isArray(sxProps) ? sxProps : [sxProps]
    } else {
        return []
    }
}