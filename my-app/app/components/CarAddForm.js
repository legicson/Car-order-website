"use client";

import formStyles from "./UI/formStyles";

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
  return (
    <form onSubmit={handleAddingCarCustomer} style={formStyles.card}>
      <h2 style={formStyles.title}>Naujas automobilis</h2>

      <div style={formStyles.fields}>
        <div style={formStyles.field}>
          <label style={formStyles.label}>Markė</label>
          <input
            className="app-input"
            type="text"
            value={carName}
            onChange={(e) => setCarName(e.target.value)}
            placeholder="Mercedes"
          />
        </div>

        <div style={formStyles.field}>
          <label style={formStyles.label}>Registracijos numeris</label>
          <input
            className="app-input"
            type="text"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            placeholder="ABC123"
          />
        </div>

        <div style={formStyles.field}>
          <label style={formStyles.label}>Metai</label>
          <input
            className="app-input"
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="2020"
          />
        </div>
      </div>

      <div style={formStyles.buttonRow}>
        <button type="submit" className="app-btn app-btn-primary">
          Sukurti
        </button>
        <button
          type="button"
          className="app-btn app-btn-secondary"
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
