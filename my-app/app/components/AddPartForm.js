"use client";

import formStyles from "./UI/formStyles";

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
  return (
    <form onSubmit={handlePartAdding} style={formStyles.card}>
      <h2 style={formStyles.title}>Nauja dalis</h2>

      <div style={formStyles.fields}>
        <div style={formStyles.field}>
          <label style={formStyles.label}>Pavadinimas</label>
          <input
            className="app-input"
            type="text"
            value={partName}
            onChange={(e) => setPartName(e.target.value)}
            placeholder="Motul 5W30"
            minLength={3}
          />
        </div>

        <div style={formStyles.field}>
          <label style={formStyles.label}>Kaina</label>
          <input
            className="app-input"
            type="text"
            value={partPrice}
            onChange={(e) => setPartPrice(e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div style={formStyles.field}>
          <label style={formStyles.label}>Dalies kodas</label>
          <input
            className="app-input"
            type="text"
            value={partNumber}
            onChange={(e) => setPartNumber(e.target.value)}
            placeholder="132-123-123"
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
