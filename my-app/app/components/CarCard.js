import React from "react";
import PropTypes from "prop-types";
import { colors, radius, shadow, space } from "../theme";

const Detail = ({ label, value }) => (
  <div style={styles.detail}>
    <span style={styles.detailLabel}>{label}</span>
    <span style={styles.detailValue}>{value || "-"}</span>
  </div>
);

const CarCard = ({
  id,
  carName,
  customerName,
  registrationNumber,
  year,
  vin,
  onClick,
  onClickDelete,
}) => {
  return (
    <div
      onClick={onClick}
      data-id={id}
      className={`app-card${onClick ? " app-card-interactive" : ""}`}
      style={styles.root}
    >
      <div style={styles.identity}>
        <h2 style={styles.header}>{carName || "Nežinomas automobilis"}</h2>
        <span style={styles.subText}>
          {customerName || "Nežinomas klientas"}
        </span>
      </div>

      <div style={styles.details}>
        <Detail label="Numeris" value={registrationNumber} />
        <Detail label="Metai" value={year} />
        <Detail label="VIN" value={vin} />
      </div>

      {onClickDelete && (
        <button
          type="button"
          className="app-icon-btn"
          aria-label="Pašalinti automobilį"
          onClick={(event) => {
            event.stopPropagation();
            onClickDelete();
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
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: space.lg,
    width: "100%",
    padding: `${space.lg} ${space.xl}`,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.lg,
    boxShadow: shadow.sm,
  },
  identity: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    flex: "1 1 180px",
    minWidth: 0,
  },
  header: {
    margin: 0,
    fontSize: "1.05rem",
    fontWeight: 600,
    color: colors.text,
  },
  subText: {
    fontSize: "0.85rem",
    color: colors.textMuted,
  },
  details: {
    display: "flex",
    flexWrap: "wrap",
    gap: space.xl,
    flex: "2 1 320px",
  },
  detail: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    minWidth: 0,
  },
  detailLabel: {
    fontSize: "0.7rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: colors.textSubtle,
  },
  detailValue: {
    fontSize: "0.95rem",
    fontWeight: 500,
    color: colors.text,
    overflowWrap: "anywhere",
  },
};

CarCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  carName: PropTypes.string,
  customerName: PropTypes.string,
  registrationNumber: PropTypes.string,
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  vin: PropTypes.string,
  onClick: PropTypes.func,
  onClickDelete: PropTypes.func,
};

export default CarCard;
