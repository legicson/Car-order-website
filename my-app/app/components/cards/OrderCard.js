import PropTypes from "prop-types";
import { colors, radius, shadow, space } from "../../theme";
import { getStatusLabel, getStatusStyle } from "../StatusDropdown";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString();
};

const formatMoney = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const number = Number(value);
  return Number.isNaN(number) ? value : `${number.toFixed(2)} €`;
};

// totalPrice (cost of parts) and totalRevenue (parts at retail plus labor) are
// calculated by the caller from the order's order_items and labor_items, so the
// card always reflects the current contents of the order.
const OrderCard = ({
  id,
  customerName,
  carName,
  createdAt,
  totalPrice,
  totalRevenue,
  status,
  onClick,
  onDelete,
}) => {
  const statusStyle = getStatusStyle(status);

  return (
    <div
      onClick={onClick}
      data-id={id}
      className={`app-card app-status-stripe${onClick ? " app-card-interactive" : ""}`}
      style={{ ...styles.root, "--status-color": statusStyle.color }}
    >
      <div style={styles.identity}>
        <span style={styles.orderId}>#{id}</span>
        <div style={styles.names}>
          <h2 style={styles.header}>{customerName || "Nežinomas klientas"}</h2>
          <span style={styles.subText}>
            {carName || "Nežinomas automobilis"}
            {createdAt ? ` · ${formatDate(createdAt)}` : ""}
          </span>
        </div>
      </div>

      <div style={styles.figures}>
        <div style={styles.figure}>
          <span style={styles.figureLabel}>Savikaina</span>
          <span style={styles.figureValue}>{formatMoney(totalPrice)}</span>
        </div>

        <div style={styles.figure}>
          <span style={styles.figureLabel}>Pajamos</span>
          <span style={styles.figureValue}>{formatMoney(totalRevenue)}</span>
        </div>
        <div style={styles.figure}>
          <span style={styles.figureLabel}>Pelnas</span>
          <span style={styles.figureValue}>
            {formatMoney(totalRevenue - totalPrice)}
          </span>
        </div>
      </div>

      <div style={styles.actions}>
        <span style={{ ...styles.statusBadge, ...statusStyle }}>
          <span
            style={{ ...styles.statusDot, backgroundColor: statusStyle.color }}
          />
          {getStatusLabel(status)}
        </span>
        {onDelete && (
          <button
            type="button"
            className="app-icon-btn"
            aria-label="Pašalinti užsakymą"
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
          >
            &times;
          </button>
        )}
      </div>
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
    padding: `${space.lg} ${space.xl} ${space.lg} 28px`,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.lg,
    boxShadow: shadow.sm,
  },
  identity: {
    display: "flex",
    alignItems: "center",
    gap: space.md,
    flex: "2 1 220px",
    minWidth: 0,
  },
  orderId: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "44px",
    padding: "4px 8px",
    flexShrink: 0,
    backgroundColor: colors.surfaceAlt,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.sm,
    color: colors.textMuted,
    fontSize: "0.8rem",
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums",
  },
  names: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
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
  figures: {
    display: "flex",
    flexWrap: "wrap",
    gap: space.xl,
    flex: "1 1 180px",
  },
  figure: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  figureLabel: {
    fontSize: "0.7rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: colors.textSubtle,
  },
  figureValue: {
    fontSize: "1rem",
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums",
    color: colors.text,
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: space.sm,
    marginLeft: "auto",
  },
  statusDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 12px",
    borderRadius: radius.pill,
    fontSize: "0.8rem",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
};

OrderCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  customerName: PropTypes.string,
  carName: PropTypes.string,
  createdAt: PropTypes.string,
  totalPrice: PropTypes.number,
  totalRevenue: PropTypes.number,
  status: PropTypes.string,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
};

export default OrderCard;
