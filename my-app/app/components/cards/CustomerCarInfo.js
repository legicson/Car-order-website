import PropTypes from "prop-types";
import { colors, radius, space } from "../../theme";

const Field = ({ label, value }) => (
  <div style={styles.field}>
    <span style={styles.label}>{label}</span>
    <span style={styles.value}>{value ?? "-"}</span>
  </div>
);

const CustomerCarInfo = ({ customer, car, mileage }) => {
  return (
    <div style={styles.root}>
      <Field label="Klientas" value={customer?.name} />
      <Field label="Telefonas" value={customer?.phone_number} />
      <Field
        label="Automobilis"
        value={
          car?.car_name
            ? `${car.car_name}${car.registration_no ? ` · ${car.registration_no}` : ""}`
            : undefined
        }
      />
      <Field
        label="Rida"
        value={mileage || mileage === 0 ? `${mileage} km` : undefined}
      />
    </div>
  );
};

const styles = {
  root: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: space.md,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: `${space.md} ${space.lg}`,
    backgroundColor: colors.surfaceAlt,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.md,
    minWidth: 0,
  },
  label: {
    fontSize: "0.7rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: colors.textSubtle,
  },
  value: {
    fontSize: "1rem",
    fontWeight: 600,
    color: colors.text,
    overflowWrap: "anywhere",
  },
};

CustomerCarInfo.propTypes = {
  customer: PropTypes.shape({
    name: PropTypes.string,
    phone_number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  car: PropTypes.shape({
    car_name: PropTypes.string,
    registration_no: PropTypes.string,
  }),
  mileage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CustomerCarInfo;
