import PropTypes from "prop-types";
import { colors, radius, shadow, space } from "../../theme";

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
  comment,
  onClick,
  onClickDelete,
}) => {
  return (
    <div
      onClick={onClick}
      data-id={id}
      className={`app-card${onClickDelete ? " app-card-corner" : ""}${onClick ? " app-card-interactive" : ""}`}
      style={styles.root}
    >
      <div style={styles.identity}>
        <h2 style={styles.header}>{carName || "Nežinomas automobilis"}</h2>
        <span style={styles.subText}>
          {customerName || "Nežinomas klientas"}
        </span>
      </div>

      <div style={styles.details}>
        <div style={styles.detail}>
          <span style={styles.detailLabel}>Numeris</span>
          {registrationNumber ? (
            <span style={styles.plate}>{registrationNumber}</span>
          ) : (
            <span style={styles.detailValue}>-</span>
          )}
        </div>
        <Detail label="Metai" value={year} />
        <Detail label="VIN" value={vin} />
      </div>

      {onClickDelete && (
        <button
          type="button"
          className="app-icon-btn app-card-delete"
          aria-label="Pašalinti automobilį"
          onClick={(event) => {
            event.stopPropagation();
            onClickDelete();
          }}
        >
          &times;
        </button>
      )}

      {comment && (
        <div style={styles.comment}>
          <span style={styles.detailLabel}>Komentaras</span>
          <span style={styles.commentValue}>{comment}</span>
        </div>
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
  plate: {
    alignSelf: "flex-start",
    padding: "2px 8px",
    border: `1.5px solid ${colors.text}`,
    borderRadius: "4px",
    backgroundColor: colors.surface,
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: "0.85rem",
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: colors.text,
  },
  comment: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    flex: "1 1 100%",
    minWidth: 0,
  },
  commentValue: {
    fontSize: "0.9rem",
    color: colors.textMuted,
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
  comment: PropTypes.string,
  onClick: PropTypes.func,
  onClickDelete: PropTypes.func,
};

export default CarCard;
