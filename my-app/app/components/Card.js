import React from "react";
import PropTypes from "prop-types";
import { CardHeader } from "react-bootstrap";

const Card = ({ id, onClick, header, addionalDetails }) => {
  return (
    <div onClick={onClick} data-id={id} style={styles.root}>
      <h2 style={styles.cardHeader}>{header}</h2>
      <p style={styles.cardText}>{addionalDetails}</p>
    </div>
  );
};

const styles = {
  root: {
    backgroundColor: "white",
    borderRadius: "20px",
    height: "4vh",
    width: "100%",
    cursor: "pointer",
    margin: "0.3vh 0",
    padding: "0 5vh",

    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
  },
  cardHeader: {
    fontSize: "1.5rem",
    margin: 0,
    padding: 0,
  },
  cardText: {
    fontSize: "1.5rem",

    margin: 0,
    padding: 0,
  },
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  idNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Card;
