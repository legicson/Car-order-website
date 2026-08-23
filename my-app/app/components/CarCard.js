import React from "react";
import PropTypes from "prop-types";

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
    <div onClick={onClick} data-id={id} style={styles.root}>
      <div style={styles.leftSection}>
        <h2 style={styles.header}>{carName || "Unknown Car"}</h2>
        <span style={styles.subText}>{customerName || "Unknown Customer"}</span>
      </div>

      <div style={styles.middleSection}>
        <span style={styles.detailText}>Reg: {registrationNumber || "-"}</span>
        <span style={styles.detailText}>Year: {year || "-"}</span>
        <span style={styles.detailText}>VIN: {vin || "-"}</span>
      </div>

      <div style={styles.rightSection}>
        {onClickDelete && (
          <button
            type="button"
            style={styles.deleteButton}
            onClick={(event) => {
              event.stopPropagation();
              onClickDelete();
            }}
          >
            X
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  root: {
    backgroundColor: "white",
    borderRadius: "20px",
    minHeight: "4vh",
    width: "100%",
    cursor: "pointer",
    margin: "0.3vh 0",
    padding: "1vh 5vh",

    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "2vh",
  },
  leftSection: {
    flex: 2,
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  header: {
    fontSize: "1.3rem",
    margin: 0,
    padding: 0,
  },
  subText: {
    fontSize: "0.9rem",
    color: "#555",
  },
  middleSection: {
    flex: 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px",
  },
  detailText: {
    fontSize: "0.9rem",
    color: "#555",
  },
  rightSection: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#b34c4c",
    fontSize: "1.2rem",
    fontWeight: "bold",
    cursor: "pointer",
    marginLeft: "2vh",
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
