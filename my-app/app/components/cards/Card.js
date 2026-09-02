import PropTypes from "prop-types";
import { colors, radius, shadow, space } from "../../theme";

const Card = ({ id, onClick, header, addionalDetails }) => {
  return (
    <div
      onClick={onClick}
      data-id={id}
      className={`app-card${onClick ? " app-card-interactive" : ""}`}
      style={styles.root}
    >
      <h2 style={styles.cardHeader}>{header}</h2>
      <p style={styles.cardText}>{addionalDetails}</p>
    </div>
  );
};

const styles = {
  root: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: space.md,
    width: "100%",
    minHeight: "56px",
    padding: `${space.md} ${space.lg}`,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.lg,
    boxShadow: shadow.sm,
    marginTop: space.sm,
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
