import React from "react";
import PropTypes from "prop-types";

const Card = ({ id, onClick, header, addionalDetails }) => {
  return (
    <div onClick={onClick} data-id={id} style={styles.root}>
      <h2>{header}</h2>
      <p>{addionalDetails}</p>
    </div>
  );
};

const styles = {
  root: {
    backgroundColor: "white",
    borderRadius: "20px",
    height: "5vh",
    width: "100%",
    cursor: "pointer",
    margin: "10px 0",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  idNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Card;
