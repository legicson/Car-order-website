import React from "react";

const ModalWrapper = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        style={styles.modal}
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the modal content
      >
        <button
          onClick={onClose}
          style={styles.closeButton}
          aria-label="Close modal"
        >
          &times;
        </button>
        <div style={styles.content}>{children}</div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    height: "45vh",
    backgroundColor: "#b2bd68",
    padding: "20px",
    borderRadius: "12px",
    position: "relative",
    width: "50vw",

    boxShell: "0 4px 20px rgba(0, 0, 0, 0.2)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "15px",
    border: "none",
    background: "none",
    fontSize: "24px",
    cursor: "pointer",
    lineHeight: 1,
  },
  content: {
    // marginTop: "10px",
    // backgroundColor: "yellow",
    height: "100%",
  },
};

export default ModalWrapper;
