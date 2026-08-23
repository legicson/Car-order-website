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
        Sukurti užsakymą
      </button>
      <button
        className="app-btn app-btn-secondary"
        onClick={() => setAddCustomerModalOpen(true)}
      >
        Pridėti klientą
      </button>
      <button
        className="app-btn app-btn-secondary"
        onClick={() => setAddCarModalOpen(true)}
      >
        Pridėti automobilį
      </button>
      <button
        className="app-btn app-btn-secondary"
        onClick={() => setAddPartModalOpen(true)}
      >
        Pridėti dalį
      </button>
    </div>
  );
}

export default AddButtonsRow;

const style = {
  buttonRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: space.sm,
  },
};
