import React from "react";
import PropTypes from "prop-types";
import { colors, radius, shadow, space } from "../theme";

const PartsCard = ({ id, onClick, header, details, price, onDelete }) => {
  return (
    <div
      onClick={onClick}
      data-id={id}
      className={`app-card${onClick ? " app-card-interactive" : ""}`}
      style={styles.root}
    >
      <div style={styles.info}>
        <h2 style={styles.header}>{header}</h2>
        <div className="app-tight-text" style={styles.details}>
          {details}
        </div>
      </div>

      <p style={styles.price}>{price}</p>

      {onDelete && (
        <button
          type="button"
          className="app-icon-btn"
          aria-label="Pašalinti"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
        >
          &times;
        </button>
      )}
    </div>
  );
};

const styles = {
  root: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: space.lg,
    width: "100%",
    padding: `${space.md} ${space.lg}`,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.lg,
    boxShadow: shadow.sm,
    marginBottom: space.md,
  },
  info: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    minWidth: 0,
    flex: 1,
  },
  header: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 600,
    color: colors.text,
  },
  details: {
    fontSize: "0.85rem",
    color: colors.textMuted,
  },
  price: {
    margin: 0,
    flexShrink: 0,
    fontSize: "1rem",
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums",
    color: colors.text,
  },
};

PartsCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func,
  header: PropTypes.node,
  details: PropTypes.node,
  price: PropTypes.node,
  onDelete: PropTypes.func,
};

export default PartsCard;
