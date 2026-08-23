import React from "react";
import PropTypes from "prop-types";

const PartsCard = ({ id, onClick, header, details, price, onDelete }) => {
  return (
    <div onClick={onClick} data-id={id} style={styles.root}>
      <h2 style={styles.header}>{header}</h2>
      <div style={styles.details}>{details}</div>
      <p style={styles.price}>{price}</p>
      {onDelete && (
        <button
          type="button"
          style={styles.deleteButton}
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
        >
          X
        </button>
      )}
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
  },
  header: {
    fontSize: "1.5rem",
    margin: 0,
    padding: 0,
    flex: 1,
    textAlign: "left",
  },
  details: {
    fontSize: "1rem",
    color: "#555",
    flex: 1,
    textAlign: "center",

    display: "flex",
    flexDirection: "column",
  },
  price: {
    fontSize: "1.5rem",
    margin: 0,
    padding: 0,
    flex: 1,
    textAlign: "right",
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

PartsCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func,
  header: PropTypes.node,
  details: PropTypes.node,
  price: PropTypes.node,
  onDelete: PropTypes.func,
};

export default PartsCard;
