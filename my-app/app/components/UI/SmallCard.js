function SmallCard({ header, addionalDetails }) {
  return (
    <div style={styles.root}>
      <h2 style={styles.header}>{header}</h2>

      <p style={styles.addionalDetails}>{addionalDetails}</p>
    </div>
  );
}

export default SmallCard;

const styles = {
  root: {
    backgroundColor: "white",
    borderRadius: "20px",
    height: "5vh",
    width: "25%",
    cursor: "pointer",
    margin: "10px 10px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },
  header: {
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  addionalDetails: {
    fontSize: "1rem",
  },
};
