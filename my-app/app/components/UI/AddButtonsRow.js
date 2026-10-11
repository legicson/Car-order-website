import { space } from "../../theme";

function AddButtonsRow({
  setAddCustomerModalOpen,
  setAddOrderModalOpen,
  setAddCarModalOpen,
  setAddPartModalOpen,
}) {
  return (
    <div style={style.buttonRow}>
      <button
        className="app-btn app-btn-primary"
        onClick={() => setAddOrderModalOpen(true)}
      >
        <span aria-hidden="true">+</span> Sukurti užsakymą
      </button>
      <button
        className="app-btn app-btn-secondary"
        onClick={() => setAddCustomerModalOpen(true)}
      >
        <span aria-hidden="true">+</span> Pridėti klientą
      </button>
      <button
        className="app-btn app-btn-secondary"
        onClick={() => setAddCarModalOpen(true)}
      >
        <span aria-hidden="true">+</span> Pridėti automobilį
      </button>
      <button
        className="app-btn app-btn-secondary"
        onClick={() => setAddPartModalOpen(true)}
      >
        <span aria-hidden="true">+</span> Pridėti dalį
      </button>
    </div>
  );
}

export default AddButtonsRow;

const style = {
  buttonRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    // flexWrap: "wrap",
    gap: space.sm,
  },
};
