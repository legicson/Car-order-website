import PropTypes from "prop-types";
import { colors, radius, shadow, space } from "../../theme";

// First letters of the first two words, e.g. "Jonas Jonaitis" -> "JJ".
const initials = (value) =>
  String(value ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("") || "?";

const Card = ({ id, onClick, header, addionalDetails }) => {
  return (
    <div
      onClick={onClick}
      data-id={id}
      className={`app-card${onClick ? " app-card-interactive" : ""}`}
      style={styles.root}
    >
      <div style={styles.avatar} aria-hidden="true">
        {initials(header)}
      </div>
      <div style={styles.info}>
        <h2 style={styles.cardHeader}>{header}</h2>
        {addionalDetails && <p style={styles.cardText}>{addionalDetails}</p>}
      </div>
      {onClick && (
        <span className="app-chevron" aria-hidden="true">
          &rsaquo;
        </span>
      )}
    </div>
  );
};

const styles = {
  root: {
    display: "flex",
    alignItems: "center",
    gap: space.md,
    width: "100%",
    minHeight: "56px",
    padding: `${space.md} ${space.lg}`,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.lg,
    boxShadow: shadow.sm,
  },
  avatar: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    flexShrink: 0,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    color: colors.accent,
    fontSize: "0.85rem",
    fontWeight: 700,
  },
  info: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    flex: 1,
    minWidth: 0,
  },
  cardHeader: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 600,
    color: colors.text,
  },
  cardText: {
    margin: 0,
    fontSize: "0.9rem",
    color: colors.textMuted,
  },
};

Card.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func,
  header: PropTypes.node,
  addionalDetails: PropTypes.node,
};

export default Card;
