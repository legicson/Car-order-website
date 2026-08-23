import formStyles from "./UI/formStyles";

function CustomerForm({
  handleCustomerAdding,
  setModal,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
}) {
  return (
    <form style={formStyles.modal} onSubmit={handleCustomerAdding}>
      <h2 style={formStyles.title}>Naujas klientas</h2>

      <div style={formStyles.fields}>
        <div style={formStyles.field}>
          <label style={formStyles.label} htmlFor="customerName">
            Kliento vardas
          </label>
          <input
            id="customerName"
            className="app-input"
            placeholder="Kliento vardas"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            minLength={3}
          />
        </div>

        <div style={formStyles.field}>
          <label style={formStyles.label} htmlFor="customerPhone">
            Telefono numeris
          </label>
          <input
            id="customerPhone"
            className="app-input"
            placeholder="Telefono numeris"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            type="text"
            minLength={6}
          />
        </div>
      </div>

      <div style={formStyles.buttonRow}>
        <button type="submit" className="app-btn app-btn-primary">
          Pridėti klientą
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

export default CustomerForm;
