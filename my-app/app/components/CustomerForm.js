
function CustomerForm( {handleCustomerAdding, setModal, customerName, setCustomerName, customerPhone, setCustomerPhone}) {
  return (
    <form style={styles.formContent} onSubmit={handleCustomerAdding}>
      <div style={styles.formInput}>
        <label htmlFor="customerName">Kliento vardas:</label> <br />
        <input
          id="customerName"
          placeholder="Kliento vardas"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          style={styles.modalInput}
          minLength={3}
        />
        <label htmlFor="customerPhone">Telefono numeris:</label> <br />
        <input
          id="customerPhone"
          placeholder="Telefono numeris"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          style={styles.modalInput}
          type="text"
          minLength={6}
        />
        
      </div>

      <div style={styles.modalButtonsContainer}>
        <button type="submit" style={styles.modalButton}>
          Pridėti klientą
        </button>
        <button
          type="button"
          style={styles.modalButton}
          onClick={() => {
            setModal(false);
          }}
        >
          Uždaryti
        </button>
      </div>
    </form>
  );
}

export default CustomerForm;

const styles = {
  root: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    // backgroundColor: "#9d4c19",
    width: "90%",
  },
  pageContent: {
    // display:"flex",
    // flexDirection:"row",
    // flex:1,
    // margin: 50,
  },

  modalButtonsContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalButton: {
    borderRadius: "20px",
    width: "30%",
    height: "50px",
    margin: "10px",
  },
  modalInput: {
    width: "80%",
    height: "40px",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "25px",
  },
  formContent: {
    // margin: "7%",
    display: "flex",
    flexDirection: "column",
    // justifyContent: "center",
    // alignItems: "center",
    height: "100%",

    // backgroundColor: "red",
  },
  formInput: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // height: "100%",
    // width: "100%",
  },
};
