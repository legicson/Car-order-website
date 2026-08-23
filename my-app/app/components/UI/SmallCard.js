import { colors, radius, space } from "../../theme";

function SmallCard({ header, addionalDetails }) {
  return (
    <div style={styles.root}>
      <span style={styles.header}>{header}</span>
      <span style={styles.addionalDetails}>{addionalDetails}</span>
    </div>
  );
}

export default SmallCard;

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    padding: `${space.sm} ${space.md}`,
    backgroundColor: colors.surfaceAlt,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.md,
  },
  header: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: colors.text,
  },
  addionalDetails: {
    fontSize: "0.85rem",
    color: colors.textMuted,
  },
};
