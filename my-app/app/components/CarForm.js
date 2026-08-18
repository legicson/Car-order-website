import ListDropdown from "./UI/ListDropdown";

function CarForm({
  year,
  setYear,
  userId,
  setUserId,
  handleCarAdding,
  setModal,
  carName,
  setCarName,
  registrationNumber,
  setRegistrationNumber,
}) {
  return (
    <form style={styles.formContent} onSubmit={handleCarAdding}>
      <div style={styles.formInput}>
        <label htmlFor="customerName">Automobilio markė:</label> <br />
        <input
          id="carName"
          placeholder="Mercedes..."
          value={carName}
          onChange={(e) => setCarName(e.target.value)}
          style={styles.modalInput}
          minLength={2}
        />
        <label htmlFor="registrationNumber">Registracijos numeris:</label>{" "}
        <br />
        <input
          id="registrationNumber"
          placeholder="ABC123"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
          style={styles.modalInput}
          type="text"
          minLength={2}
        />
        <label htmlFor="year">Registracijos numeris:</label> <br />
        <input
          id="year"
          placeholder="2026"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={styles.modalInput}
          type="text"
          // minLength={6}
        />
      </div>

      <div style={styles.modalButtonsContainer}>
        <button type="submit" style={styles.modalButton}>
          Išsaugoti pakeitimus
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

export default CarForm;

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
