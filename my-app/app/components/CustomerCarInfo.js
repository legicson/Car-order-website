import React from "react";
import PropTypes from "prop-types";
import { colors, space } from "../theme";

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
      <Field label="Automobilis" value={car?.car_name} />
      <Field label="Rida" value={mileage} />
    </div>
  );
};

const styles = {
  root: {
    display: "flex",
    flexWrap: "wrap",
    gap: space.xxl,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
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
  },
};

CustomerCarInfo.propTypes = {
  customer: PropTypes.shape({
    name: PropTypes.string,
    phone_number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  car: PropTypes.shape({
    car_name: PropTypes.string,
  }),
  mileage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CustomerCarInfo;
