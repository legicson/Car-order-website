// Design tokens for inline style objects.
// The same values are mirrored as CSS variables in globals.css, which is where
// the interactive states (hover/focus) that inline styles cannot express live.

export const colors = {
  bg: "#f1f5f9",
  surface: "#ffffff",
  surfaceAlt: "#f8fafc",
  border: "#e2e8f0",
  borderStrong: "#cbd5e1",

  text: "#0f172a",
  textMuted: "#64748b",
  textSubtle: "#94a3b8",

  accent: "#2563eb",
  accentHover: "#1d4ed8",
  accentSoft: "#eff6ff",

  success: "#15803d",
  successSoft: "#dcfce7",
  warning: "#b45309",
  warningSoft: "#fef3c7",
  danger: "#b91c1c",
  dangerSoft: "#fee2e2",
};

export const space = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  xxl: "32px",
};

export const radius = {
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "20px",
  pill: "999px",
};

export const shadow = {
  sm: "0 1px 2px rgba(15, 23, 42, 0.06)",
  md: "0 4px 12px rgba(15, 23, 42, 0.08)",
  lg: "0 16px 40px rgba(15, 23, 42, 0.20)",
};

export const text = {
  pageTitle: {
    fontSize: "1.75rem",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: colors.text,
    margin: 0,
  },
  sectionTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: colors.textMuted,
    margin: 0,
  },
  label: {
    fontSize: "0.8rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: colors.textMuted,
  },
  muted: {
    fontSize: "0.9rem",
    color: colors.textMuted,
  },
};

// Shared page scaffolding so every screen lines up on the same grid.
export const layout = {
  page: {
    display: "flex",
    flexDirection: "column",
    gap: space.xl,
    width: "100%",
    maxWidth: "1100px",
    padding: `${space.xxl} ${space.xl} ${space.xxl}`,
  },
  header: {
    display: "flex",
    flexWrap: "wrap",
    gap: space.lg,
    alignItems: "center",
    justifyContent: "space-between",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
    width: "100%",
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: space.md,
    width: "100%",
  },
  panel: {
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.lg,
    boxShadow: shadow.sm,
    padding: space.xl,
  },
  emptyState: {
    padding: `${space.xxl} ${space.xl}`,
    textAlign: "center",
    color: colors.textMuted,
    backgroundColor: colors.surface,
    border: `1px dashed ${colors.borderStrong}`,
    borderRadius: radius.lg,
  },
};

const theme = { colors, space, radius, shadow, text, layout };

export default theme;
