import { createTheme, alpha } from "@mui/material/styles";

const SLATE = {
  50: "#F8FAFC",
  100: "#F1F5F9",
  200: "#E2E8F0",
  300: "#CBD5E1",
  400: "#94A3B8",
  500: "#64748B",
  600: "#475569",
  700: "#334155",
  800: "#1E293B",
  900: "#0F172A",
};

export const COLOR_PRESETS = [
  { name: "Azul",      value: "#2563EB" },
  { name: "Índigo",    value: "#4F46E5" },
  { name: "Violeta",   value: "#7C3AED" },
  { name: "Rosa",      value: "#E11D48" },
  { name: "Laranja",   value: "#EA580C" },
  { name: "Âmbar",     value: "#D97706" },
  { name: "Esmeralda", value: "#059669" },
  { name: "Teal",      value: "#0D9488" },
  { name: "Ciano",     value: "#0891B2" },
] as const;

export const DEFAULT_PRIMARY = COLOR_PRESETS[0].value;

export function createAppTheme(
  mode: "light" | "dark",
  primaryColor: string,
) {
  const isLight = mode === "light";

  return createTheme({
    palette: {
      mode,
      primary: { main: primaryColor },
      secondary: {
        main: isLight ? "#7C3AED" : "#A78BFA",
      },
      error: {
        main: "#EF4444",
        light: "#FCA5A5",
        dark: "#DC2626",
        contrastText: "#ffffff",
      },
      warning: {
        main: "#F59E0B",
        light: "#FCD34D",
        dark: "#D97706",
        contrastText: "#ffffff",
      },
      success: {
        main: "#10B981",
        light: "#6EE7B7",
        dark: "#059669",
        contrastText: "#ffffff",
      },
      info: {
        main: primaryColor,
        contrastText: "#ffffff",
      },
      background: {
        default: isLight ? SLATE[100] : SLATE[900],
        paper:   isLight ? "#ffffff"  : SLATE[800],
      },
      text: {
        primary:   isLight ? SLATE[900] : SLATE[50],
        secondary: isLight ? SLATE[500] : SLATE[400],
      },
      divider: isLight ? SLATE[200] : SLATE[700],
      action: {
        hover:    isLight ? alpha(primaryColor, 0.05) : alpha(primaryColor, 0.1),
        selected: isLight ? alpha(primaryColor, 0.08) : alpha(primaryColor, 0.15),
      },
    },

    typography: {
      fontFamily:
        'var(--font-geist-sans), "Inter", system-ui, -apple-system, sans-serif',
      h1: { fontWeight: 800, letterSpacing: "-0.025em" },
      h2: { fontWeight: 700, letterSpacing: "-0.02em" },
      h3: { fontWeight: 700, letterSpacing: "-0.015em" },
      h4: { fontWeight: 600, letterSpacing: "-0.01em" },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
      subtitle2: { fontWeight: 500 },
      body2: { lineHeight: 1.6 },
      button: { fontWeight: 600, textTransform: "none" as const, letterSpacing: "0.01em" },
      caption: { fontWeight: 500 },
    },

    shape: { borderRadius: 10 },

    components: {
      // ── Button ─────────────────────────────────────────────────────────────
      MuiButton: {
        styleOverrides: {
          root: ({ theme, ownerState }) => ({
            borderRadius: 8,
            padding: "7px 16px",
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
            // Disabled: fade the whole button, not just the text
            "&.Mui-disabled": {
              opacity: 0.45,
              ...(ownerState.variant === "contained" && {
                color: "#ffffff",
              }),
            },
            // Primary contained gradient
            ...(ownerState.variant === "contained" &&
              (!ownerState.color || ownerState.color === "primary") && {
                background: `linear-gradient(145deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`,
                "&:hover": {
                  background: `linear-gradient(145deg, ${alpha(theme.palette.primary.light, 0.9)} 0%, ${alpha(theme.palette.primary.dark, 0.9)} 100%)`,
                },
              }),
            // Outlined
            ...(ownerState.variant === "outlined" && {
              borderColor: isLight ? SLATE[300] : SLATE[600],
              color: isLight ? SLATE[700] : SLATE[200],
              "&:hover": {
                borderColor: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.06),
              },
            }),
            // Text
            ...(ownerState.variant === "text" && {
              color: isLight ? SLATE[600] : SLATE[300],
              "&:hover": {
                backgroundColor: isLight ? SLATE[100] : SLATE[700],
              },
            }),
          }),
        },
      },

      // ── Paper ───────────────────────────────────────────────────────────────
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: `1px solid ${isLight ? SLATE[200] : SLATE[700]}`,
          },
          elevation0: { boxShadow: "none" },
          elevation1: {
            boxShadow: isLight
              ? `0 1px 3px ${alpha(SLATE[900], 0.06)}`
              : `0 1px 3px ${alpha("#000", 0.3)}`,
          },
          elevation2: {
            boxShadow: isLight
              ? `0 4px 12px ${alpha(SLATE[900], 0.08)}`
              : `0 4px 12px ${alpha("#000", 0.35)}`,
          },
          elevation3: {
            boxShadow: isLight
              ? `0 8px 24px ${alpha(SLATE[900], 0.1)}`
              : `0 8px 24px ${alpha("#000", 0.4)}`,
          },
        },
      },

      // ── Card ────────────────────────────────────────────────────────────────
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            border: `1px solid ${isLight ? SLATE[200] : SLATE[700]}`,
            boxShadow: isLight
              ? `0 1px 3px ${alpha(SLATE[900], 0.06)}`
              : `0 2px 8px ${alpha("#000", 0.25)}`,
            backgroundColor: isLight ? "#ffffff" : SLATE[800],
            transition: "box-shadow 0.2s ease, border-color 0.2s ease",
            "&:hover": {
              boxShadow: isLight
                ? `0 4px 12px ${alpha(SLATE[900], 0.1)}`
                : `0 6px 20px ${alpha("#000", 0.35)}`,
              borderColor: isLight ? SLATE[300] : SLATE[600],
            },
          },
        },
      },

      // ── AppBar ──────────────────────────────────────────────────────────────
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: isLight
              ? alpha("#ffffff", 0.88)
              : alpha(SLATE[900], 0.9),
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: `1px solid ${isLight ? SLATE[200] : SLATE[700]}`,
            color: isLight ? SLATE[900] : SLATE[50],
            boxShadow: "none",
          },
        },
      },

      // ── Drawer ──────────────────────────────────────────────────────────────
      MuiDrawer: {
        styleOverrides: {
          paper: {
            border: "none",
            borderRight: `1px solid ${isLight ? SLATE[200] : SLATE[700]}`,
            boxShadow: isLight
              ? "none"
              : `4px 0 24px ${alpha("#000", 0.4)}`,
            backgroundColor: isLight ? "#ffffff" : SLATE[900],
          },
        },
      },

      // ── Input ───────────────────────────────────────────────────────────────
      MuiTextField: {
        defaultProps: { size: "small" as const },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 8,
            backgroundColor: isLight ? "#ffffff" : alpha(SLATE[900], 0.5),
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: isLight ? SLATE[300] : SLATE[600],
              transition: "border-color 0.15s ease",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.light,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
              borderWidth: "1.5px",
            },
            "& input[type=date]::-webkit-calendar-picker-indicator": isLight
              ? {}
              : { filter: "invert(1) brightness(0.8)" },
          }),
        },
      },

      // ── Tabs ────────────────────────────────────────────────────────────────
      MuiTabs: {
        styleOverrides: {
          indicator: ({ theme }) => ({
            height: 2,
            borderRadius: "2px 2px 0 0",
            background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          }),
        },
      },
      MuiTab: {
        styleOverrides: {
          root: ({ theme }) => ({
            fontWeight: 500,
            textTransform: "none" as const,
            letterSpacing: 0,
            color: isLight ? SLATE[500] : SLATE[400],
            "&.Mui-selected": {
              color: theme.palette.primary.main,
              fontWeight: 600,
            },
          }),
        },
      },

      // ── Chip ────────────────────────────────────────────────────────────────
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 6, fontWeight: 500 },
          colorPrimary: ({ theme }) => ({
            backgroundColor: alpha(theme.palette.primary.main, isLight ? 0.1 : 0.18),
            color: isLight ? theme.palette.primary.dark : theme.palette.primary.light,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
          }),
        },
      },

      // ── ListItemButton ──────────────────────────────────────────────────────
      MuiListItemButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 8,
            margin: "1px 0",
            "&.Mui-selected": {
              backgroundColor: alpha(theme.palette.primary.main, isLight ? 0.08 : 0.15),
              color: isLight ? theme.palette.primary.dark : theme.palette.primary.light,
              fontWeight: 600,
              "& .MuiListItemIcon-root": {
                color: isLight ? theme.palette.primary.dark : theme.palette.primary.light,
              },
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, isLight ? 0.12 : 0.2),
              },
            },
            "&:hover": {
              backgroundColor: isLight ? SLATE[100] : SLATE[800],
            },
          }),
        },
      },

      // ── Table ───────────────────────────────────────────────────────────────
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 600,
            fontSize: "0.75rem",
            textTransform: "uppercase" as const,
            letterSpacing: "0.05em",
            color: isLight ? SLATE[500] : SLATE[400],
            backgroundColor: isLight ? SLATE[50] : SLATE[900],
            borderBottom: `2px solid ${isLight ? SLATE[200] : SLATE[700]}`,
          },
          body: {
            borderBottom: `1px solid ${isLight ? SLATE[100] : SLATE[800]}`,
          },
        },
      },

      // ── Tooltip ─────────────────────────────────────────────────────────────
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 6,
            fontSize: "0.72rem",
            fontWeight: 500,
            backgroundColor: isLight ? SLATE[800] : SLATE[700],
            border: isLight ? "none" : `1px solid ${SLATE[600]}`,
            padding: "5px 10px",
          },
          arrow: { color: isLight ? SLATE[800] : SLATE[700] },
        },
      },

      // ── Dialog ──────────────────────────────────────────────────────────────
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            border: `1px solid ${isLight ? SLATE[200] : SLATE[700]}`,
            boxShadow: isLight
              ? `0 20px 60px ${alpha(SLATE[900], 0.15)}`
              : `0 20px 60px ${alpha("#000", 0.5)}`,
            backgroundColor: isLight ? "#ffffff" : SLATE[800],
          },
        },
      },

      // ── IconButton ──────────────────────────────────────────────────────────
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            "&:hover": {
              backgroundColor: isLight ? SLATE[100] : SLATE[700],
            },
          },
        },
      },

      // ── Avatar ──────────────────────────────────────────────────────────────
      MuiAvatar: {
        styleOverrides: {
          root: ({ theme }) => ({
            background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
            fontWeight: 600,
          }),
        },
      },

      // ── Autocomplete ────────────────────────────────────────────────────────
      MuiAutocomplete: {
        styleOverrides: {
          paper: {
            borderRadius: 10,
            backgroundColor: isLight ? "#ffffff" : SLATE[800],
          },
          option: ({ theme }) => ({
            borderRadius: 6,
            margin: "1px 4px",
            '&[aria-selected="true"]': {
              backgroundColor: `${alpha(theme.palette.primary.main, 0.12)} !important`,
              color: isLight ? theme.palette.primary.dark : theme.palette.primary.light,
            },
            "&:hover": {
              backgroundColor: isLight ? SLATE[100] : SLATE[700],
            },
          }),
        },
      },

      // ── Divider ─────────────────────────────────────────────────────────────
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: isLight ? SLATE[200] : SLATE[700] },
        },
      },

      // ── Backdrop ────────────────────────────────────────────────────────────
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backgroundColor: isLight
              ? alpha(SLATE[900], 0.5)
              : alpha("#000", 0.65),
          },
        },
      },
    },
  });
}
