import { CSSObject, Theme } from '@mui/material'

export const autoCompleteStyle = (theme: Theme): CSSObject => ({
  "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.secondary.light,
  },
  "& .MuiOutlinedInput-root.Mui-disabled:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.secondary.light,
  },
})
