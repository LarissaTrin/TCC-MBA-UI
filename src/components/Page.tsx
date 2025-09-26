'use client'

import { Box, BoxProps, Typography, TypographyProps } from '@mui/material'
import React, { ReactNode } from 'react'

// Main Page component
export const GenericPage: React.FC<BoxProps> & {
  Header: React.FC<BoxProps>
  Title: React.FC<TypographyProps>
  Breadcrumbs: React.FC<BoxProps>
  Sidebar: React.FC<BoxProps>
  Content: React.FC<BoxProps>
  InlineButtons: React.FC<BoxProps>
} = props => {
  const { sx, ...otherProps } = props
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem',
        gap: '16px',
        ...sx,
      }}
      {...otherProps}
    />
  )
}

// Header component
GenericPage.Header = ((props: BoxProps) => {
  const { sx, ...otherProps } = props
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: '16px',
        ...sx,
      }}
      {...otherProps}
    />
  )
}) as React.FC<{ children: ReactNode }> as React.FC<BoxProps>
GenericPage.Header.displayName = 'PageHeader'

// Title component
GenericPage.Title = (({ ...props }: TypographyProps) => {
  return (
    <Box textAlign="left" mb={2}>
      <Typography variant="h5"  {...props} />
    </Box>
  )
}) as React.FC<TypographyProps>
GenericPage.Title.displayName = 'PageTitle'

// Breadcrumbs component
GenericPage.Breadcrumbs = ((props: BoxProps) => {
  return <Box {...props} />
}) as React.FC<BoxProps>
GenericPage.Breadcrumbs.displayName = 'PageBreadcrumbs'

// InlineButtons component
GenericPage.InlineButtons = ((props: BoxProps) => {
  const { sx, ...otherProps } = props
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        width: 'fit-content',
        gap: '1.25rem',
        ...sx,
      }}
      {...otherProps}
    />
  )
}) as React.FC<{
  children: ReactNode
}> as React.FC<BoxProps>
GenericPage.InlineButtons.displayName = 'PageInlineButtons'

// Sidebar component
GenericPage.Sidebar = (({ ...props }: BoxProps) => {
  const { sx, ...otherProps } = props
  return (
    <Box
      sx={{
        width: '300px',
        borderRightWidth: '1px',
        borderRightColor: 'divider',
        borderRightStyle: 'solid',
        ...sx,
      }}
      {...otherProps}
    />
  )
}) as React.FC<BoxProps>
GenericPage.Sidebar.displayName = 'PageSidebar'

// Page.Content component
GenericPage.Content = ((props: BoxProps) => {
  const { sx, ...otherProps } = props
  return (
    <Box
      sx={{
        padding: '1.5rem',
        ...sx,
      }}
      {...otherProps}
    />
  )
}) as React.FC<BoxProps>
GenericPage.Content.displayName = 'PageContent'
