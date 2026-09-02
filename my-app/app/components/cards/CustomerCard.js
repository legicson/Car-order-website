import PropTypes from "prop-types";
import { colors, radius, shadow, space } from "../../theme";

// Above this many cars the list is replaced by a plain count.
const MAX_VISIBLE_CARS = 3;

// Lietuviška daugiskaita: 1 automobilis, 2-9 automobiliai, 10-19 automobilių.
const carCountLabel = (count) => {
  const lastTwo = count % 100;
  const last = count % 10;

  if (lastTwo >= 11 && lastTwo <= 19) return `${count} automobilių`;
  if (last === 1) return `${count} automobilis`;
  if (last === 0) return `${count} automobilių`;
  return `${count} automobiliai`;
};

const CustomerCard = ({
  id,
  customerName,
  phoneNumber,
  cars = [],
  onClick,
  onClickDelete,
}) => {
  const renderCars = () => {
    if (cars.length === 0) {
      return <span style={styles.noCars}>Automobilių nėra</span>;
    }

    if (cars.length > MAX_VISIBLE_CARS) {
      return <span style={styles.countBadge}>{carCountLabel(cars.length)}</span>;
    }

    return cars.map((car) => (
      <span key={car.id} style={styles.carChip}>
        <span style={styles.carName}>{car.car_name || "Nežinomas"}</span>
        {car.registration_no && (
          <span style={styles.carPlate}>{car.registration_no}</span>
        )}
      </span>
    ));
  };

  return (
    <div
      onClick={onClick}
      data-id={id}
      className={`app-card${onClick ? " app-card-interactive" : ""}`}
      style={styles.root}
    >
      <div style={styles.identity}>
        <h2 style={styles.header}>{customerName || "Nežinomas klientas"}</h2>
        <span style={styles.subText}>{phoneNumber || "Nenurodytas"}</span>
      </div>

      <div style={styles.cars}>{renderCars()}</div>

      {onClickDelete && (
        <button
          type="button"
          className="app-icon-btn"
          aria-label="Pašalinti klientą"
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
  cars: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: space.sm,
    flex: "1 1 auto",
  },
  carChip: {
    display: "inline-flex",
    alignItems: "baseline",
    gap: space.sm,
    padding: `4px ${space.md}`,
    backgroundColor: colors.surfaceAlt,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.pill,
  },
  carName: {
    fontSize: "0.85rem",
    fontWeight: 600,
    color: colors.text,
  },
  carPlate: {
    fontSize: "0.75rem",
    color: colors.textMuted,
    fontVariantNumeric: "tabular-nums",
  },
  countBadge: {
    padding: `4px ${space.md}`,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    fontSize: "0.85rem",
    fontWeight: 600,
    color: colors.accent,
    whiteSpace: "nowrap",
  },
  noCars: {
    fontSize: "0.85rem",
    color: colors.textSubtle,
  },
};

CustomerCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  customerName: PropTypes.string,
  phoneNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  cars: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      car_name: PropTypes.string,
      registration_no: PropTypes.string,
    }),
  ),
  onClick: PropTypes.func,
  onClickDelete: PropTypes.func,
};

export default CustomerCard;
