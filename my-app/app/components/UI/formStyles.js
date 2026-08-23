import { colors, radius, shadow, space, text } from "../../theme";

// Every form in the app is the same shape: a stack of labelled fields with a
// button row underneath. These are shared so the six form components stay in
// step instead of each carrying its own copy.

export const formStyles = {
  // Free-standing form rendered directly on a page.
  card: {
    display: "flex",
    flexDirection: "column",
    gap: space.xl,
    width: "100%",
    maxWidth: "480px",
    padding: space.xxl,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.lg,
    boxShadow: shadow.md,
  },
  // Form rendered inside ModalWrapper, which already supplies the surface.
  modal: {
    display: "flex",
    flexDirection: "column",
    gap: space.xl,
    width: "100%",
  },
  title: {
    ...text.pageTitle,
    fontSize: "1.35rem",
  },
  fields: {
    display: "flex",
    flexDirection: "column",
    gap: space.lg,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
  },
  label: text.label,
  buttonRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: space.sm,
  },
};

export default formStyles;
