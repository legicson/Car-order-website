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
    maxWidth: "520px",
    margin: "0 auto",
    padding: space.xxl,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderTop: `4px solid ${colors.accent}`,
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
  // Shown next to the label for fields that are safe to leave blank.
  labelHint: {
    ...text.label,
    color: colors.textSubtle,
    textTransform: "none",
    letterSpacing: "normal",
    fontWeight: 500,
  },
  // Validation message under a field, plus the border override for the input
  // it belongs to.
  error: {
    fontSize: "0.8rem",
    color: colors.danger,
  },
  inputError: {
    borderColor: colors.danger,
  },
  buttonRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: space.sm,
    paddingTop: space.lg,
    borderTop: `1px solid ${colors.border}`,
  },
  // Live-calculated value shown under a field (e.g. customer price).
  computed: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: space.xs,
    padding: `${space.sm} ${space.md}`,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.sm,
    fontSize: "0.85rem",
    color: colors.accent,
    fontWeight: 600,
  },
};

export default formStyles;
