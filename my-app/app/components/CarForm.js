import formStyles from "./UI/formStyles";

function CarForm({
  year,
  setYear,
  handleCarAdding,
  setModal,
  carName,
  setCarName,
  registrationNumber,
  setRegistrationNumber,
  commnent,
  setCommnent,
}) {
  return (
    <form style={formStyles.modal} onSubmit={handleCarAdding}>
      <h2 style={formStyles.title}>Automobilis</h2>

      <div style={formStyles.fields}>
        <div style={formStyles.field}>
          <label style={formStyles.label} htmlFor="carName">
            Automobilio markė
          </label>
          <input
            id="carName"
            className="app-input"
            placeholder="Mercedes..."
            value={carName}
            onChange={(e) => setCarName(e.target.value)}
            minLength={2}
          />
        </div>

        <div style={formStyles.field}>
          <label style={formStyles.label} htmlFor="registrationNumber">
            Registracijos numeris
          </label>
          <input
            id="registrationNumber"
            className="app-input"
            placeholder="ABC123"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            type="text"
            minLength={2}
          />
        </div>

        <div style={formStyles.field}>
          <label style={formStyles.label} htmlFor="year">
            Metai
          </label>
          <input
            id="year"
            className="app-input"
            placeholder="2026"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            type="text"
          />
        </div>
      </div>

      <div style={formStyles.buttonRow}>
        <button type="submit" className="app-btn app-btn-primary">
          Išsaugoti pakeitimus
        </button>
        <button
          type="button"
          className="app-btn app-btn-secondary"
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
