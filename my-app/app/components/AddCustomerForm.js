export default function AddCustomerForm({
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  handleContinueClick,
  setShowCustomerForm,
  resetValues,
}) {
  return (
    <form onSubmit={handleContinueClick} style={style.formContainer}>
      <div style={style.formInputContainer}>
        <label style={style.formLabel}>Vardas Pavarde</label>
        <input
          style={style.formInput}
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Jonas Jonaitis"
          minLength={3}
        />
        <label style={style.formLabel}>Telefono numeris</label>
        <input
          style={style.formInput}
          type="text"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          placeholder="+37061234567"
        />
      </div>

      <div style={style.formButtonContainer}>
        <button type="submit" style={style.formButton}>
          Tęsti
        </button>
        <button
          type="button"
          style={style.formButton}
          onClick={() => {
            setShowCustomerForm(false);
            resetValues();
          }}
        >
          Grįžti
        </button>
      </div>
    </form>
  );
}

const style = {
  formContainer: {
    display: "flex",
    // flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: " #41bb7e",
    borderRadius: "20px",
    // height: "10vh",
    width: "50%",
    height: "40vh",
    marginTop: "10%",
  },

  formLabel: {
    width: "50%",
    margin: "10px",
    textAlign: "center",
    fontWeight: "bold",
  },
  formInput: {
    width: "50%",
    margin: "10px",
    textAlign: "center",
    borderRadius: "20px",
  },

  formButtonContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  formButton: {
    borderRadius: "20px",
    width: "30%",
    height: "50px",
    margin: "10px",
  },
  formInputContainer: {
    display: "flex",
    flex: 1,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
};
