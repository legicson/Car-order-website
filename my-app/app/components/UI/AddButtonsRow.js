function AddButtonsRow({
  setAddCustomerModalOpen,
  setAddOrderModalOpen,
  setAddCarModalOpen,
  setAddPartModalOpen,
}) {
  return (
    <>
      <div style={style.buttonRow}>
        <button
          style={style.addButton}
          onClick={() => setAddCustomerModalOpen(true)}
        >
          Pridėti klientą
        </button>
        <button
          style={style.addButton}
          onClick={() => setAddCustomerModalOpen(true)}
        >
          Sukurti užsakymą
        </button>
        <button
          style={style.addButton}
          onClick={() => setAddCustomerModalOpen(true)}
        >
          Pridėti automobilį
        </button>
        <button
          style={style.addButton}
          onClick={() => setAddCustomerModalOpen(true)}
        >
          Pridėti dalį
        </button>
      </div>
    </>
  );
}

export default AddButtonsRow;

const style = {
  addButton: {
    borderRadius: "15px",
    margin: "10px",
    width: "200px",
    height: "50px",
    backgroundColor: "#9539F2",
    border: "none",
    color: "#eaecf3e0",
    fontWeight: "bold",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
};
