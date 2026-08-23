import formStyles from "./UI/formStyles";

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
    <form onSubmit={handleContinueClick} style={formStyles.card}>
      <h2 style={formStyles.title}>Naujas klientas</h2>

      <div style={formStyles.fields}>
        <div style={formStyles.field}>
          <label style={formStyles.label}>Vardas pavardė</label>
          <input
            className="app-input"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Jonas Jonaitis"
            minLength={3}
          />
        </div>

        <div style={formStyles.field}>
          <label style={formStyles.label}>Telefono numeris</label>
          <input
            className="app-input"
            type="text"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="+37061234567"
          />
        </div>
      </div>

      <div style={formStyles.buttonRow}>
        <button type="submit" className="app-btn app-btn-primary">
          Tęsti
        </button>
        <button
          type="button"
          className="app-btn app-btn-secondary"
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
