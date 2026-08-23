import React from "react";
import { colors, radius, shadow, space } from "../theme";

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
          className="app-icon-btn"
          style={styles.closeButton}
          aria-label="Uždaryti"
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
    inset: 0,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    backdropFilter: "blur(2px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: space.lg,
    zIndex: 1000,
  },
  modal: {
    position: "relative",
    width: "100%",
    maxWidth: "560px",
    maxHeight: "85vh",
    overflowY: "auto",
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.lg,
    boxShadow: shadow.lg,
    padding: `${space.xxl} ${space.xxl} ${space.xl}`,
  },
  closeButton: {
    position: "absolute",
    top: space.md,
    right: space.md,
    fontSize: "1.5rem",
  },
  content: {
    width: "100%",
  },
};

export default ModalWrapper;
