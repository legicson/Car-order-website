import React from "react";
import PropTypes from "prop-types";

const STATUS_COLORS = {
  Vykdomas: { color: "#8a6d00", backgroundColor: "#fff3cd" },
  Baigtas: { color: "#146c43", backgroundColor: "#d1e7dd" },
  "Laukia dalių": { color: "#842029", backgroundColor: "#f8d7da" },
};

const getStatusStyle = (status) =>
  STATUS_COLORS[status] ?? { color: "#0d6efd", backgroundColor: "#e7f1ff" };

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString();
};

const formatMoney = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const number = Number(value);
  return Number.isNaN(number) ? value : number.toFixed(2);
};

const OrderCard = ({
  id,
  customerName,
  carName,
  createdAt,
  totalPrice,
  income,
  status,
  onClick,
  onDelete,
}) => {
  return (
    <div onClick={onClick} data-id={id} style={styles.root}>
      <div style={styles.leftSection}>
        <h2 style={styles.header}>{customerName || "Unknown Customer"}</h2>
        <span style={styles.subText}>{carName || "Unknown Car"}</span>
        <span style={styles.subText}>{formatDate(createdAt)}</span>
      </div>

      <div style={styles.middleSection}>
        <span style={styles.priceText}>Total: {formatMoney(totalPrice)}</span>
        <span style={styles.incomeText}>Income: {formatMoney(income)}</span>
      </div>

      <div style={styles.rightSection}>
        <span style={{ ...styles.statusBadge, ...getStatusStyle(status) }}>
          {status || "Unknown"}
        </span>
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
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  priceText: {
    fontSize: "1rem",
    fontWeight: "bold",
  },
  incomeText: {
    fontSize: "0.9rem",
    color: "#555",
  },
  rightSection: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  statusBadge: {
    fontSize: "0.9rem",
    fontWeight: "bold",
    padding: "4px 10px",
    borderRadius: "8px",
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

OrderCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  customerName: PropTypes.string,
  carName: PropTypes.string,
  createdAt: PropTypes.string,
  totalPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  income: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  status: PropTypes.string,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
};

export default OrderCard;
