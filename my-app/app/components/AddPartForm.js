"use client";

export default function AddPartForm({
  partName,
  setPartName,
  partPrice,
  setPartPrice,
  partNumber,
  setPartNumber,
  handlePartAdding,
  setShowPartForm,
  resetValues,
}) {
  const style = {
    formContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: " #41bb7e",
      borderRadius: "20px",
      width: "50%",
      height: "40vh",
      marginTop: "10%",
    },
    formInputContainer: {
      display: "flex",
      flex: 1,
      width: "100%",
      flexDirection: "column",
      alignItems: "center",
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
  };

  return (
    <form onSubmit={handlePartAdding} style={style.formContainer}>
      <div style={style.formInputContainer}>
        <label style={style.formLabel}>Pavadinimas</label>
        <input
          style={style.formInput}
          type="text"
          value={partName}
          onChange={(e) => setPartName(e.target.value)}
          placeholder="Motul 5W30"
          minLength={3}
        />
        <label style={style.formLabel}>Kaina</label>
        <input
          style={style.formInput}
          type="text"
          value={partPrice}
          onChange={(e) => setPartPrice(e.target.value)}
          placeholder="0.00"
        />
        <label style={style.formLabel}>Dalies kodas</label>
        <input
          style={style.formInput}
          type="text"
          value={partNumber}
          onChange={(e) => setPartNumber(e.target.value)}
          placeholder="132-123-123"
        />
      </div>

      <div style={style.formButtonContainer}>
        <button type="submit" style={style.formButton}>
          Sukurti
        </button>
        <button
          type="button"
          style={style.formButton}
          onClick={() => {
            setShowPartForm(false);
            resetValues();
          }}
        >
          Atšaukti
        </button>
      </div>
    </form>
  );
}
