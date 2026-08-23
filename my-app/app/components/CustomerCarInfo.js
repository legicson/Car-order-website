import React from "react";
import PropTypes from "prop-types";

const CustomerCarInfo = ({ customer, car }) => {
  return (
    <div style={styles.root}>
      <p style={styles.text}>
        <strong>Customer:</strong> {customer?.name ?? "-"}
      </p>
      <p style={styles.text}>
        <strong>Phone:</strong> {customer?.phone_number ?? "-"}
      </p>
      <p style={styles.text}>
        <strong>Car:</strong> {car?.car_name ?? "-"}
      </p>
    </div>
  );
};

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    padding: "1vh 2vh",
  },
  text: {
    fontSize: "1.2rem",
    margin: "0.2vh 0",
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
};

export default CustomerCarInfo;
