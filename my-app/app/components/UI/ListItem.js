import React from "react";

/**
 * ListItem component that takes 3 main variables to display as a styled list item row.
 * 
 * Props:
 * - title / first / header: First variable (e.g., item title, part name, car model)
 * - subtitle / second / details: Second variable (e.g., description, part number, license plate)
 * - extra / third / price: Third variable (e.g., price, date, badge/status)
 * - onClick: Optional click event handler
 */
const ListItem = ({
  title,
  first,
  header,
  subtitle,
  second,
  details,
  extra,
  third,
  price,
  onClick,
  style,
}) => {
  const displayFirst = title ?? first ?? header ?? "";
  const displaySecond = subtitle ?? second ?? details ?? "";
  const displayThird = extra ?? third ?? price ?? "";

  return (
    <li
      onClick={onClick}
      style={{
        ...styles.item,
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      <div style={styles.leftSection}>
        {displayFirst && <span style={styles.primaryText}>{displayFirst}</span>}
        {displaySecond && <span style={styles.secondaryText}>{displaySecond}</span>}
      </div>

      {displayThird && (
        <div style={styles.rightSection}>
          <span style={styles.extraText}>{displayThird}</span>
        </div>
      )}
    </li>
  );
};

const styles = {
  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: "12px 20px",
    margin: "8px 0",
    borderRadius: "12px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.08)",
    listStyleType: "none",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  },
  leftSection: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    textAlign: "left",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  primaryText: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#212529",
  },
  secondaryText: {
    fontSize: "0.9rem",
    color: "#6c757d",
  },
  extraText: {
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#0d6efd",
    backgroundColor: "#e7f1ff",
    padding: "4px 10px",
    borderRadius: "8px",
  },
};

export default ListItem;

