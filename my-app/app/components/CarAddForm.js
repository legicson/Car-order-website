"use client";

export default function CarAddForm({
  carName,
  setCarName,
  registrationNumber,
  setRegistrationNumber,
  year,
  setYear,
  handleAddingCarCustomer,
  prevStep,
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
    <form onSubmit={handleAddingCarCustomer} style={style.formContainer}>
      <div style={style.formInputContainer}>
        <label style={style.formLabel}>Markė</label>
        <input
          style={style.formInput}
          type="text"
          value={carName}
          onChange={(e) => setCarName(e.target.value)}
          placeholder="Mercedes"
        />
        <label style={style.formLabel}>Registracijos numeris</label>
        <input
          style={style.formInput}
          type="text"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
          placeholder="ABC123"
        />
        <label style={style.formLabel}>Metai</label>
        <input
          style={style.formInput}
          type="text"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="2020"
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
            prevStep();
          }}
        >
          Grįžti
        </button>
      </div>
    </form>
  );
}
