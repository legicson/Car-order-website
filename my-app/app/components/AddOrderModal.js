import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; // Importuojame klientą

function AddOrderModal({ setAddOrderModalOpen }) {
  const [orderDate, setOrderDate] = useState(Date.now());

  const addCustomer = async () => {
    if (!customerName.trim()) return;

    const { error } = await supabase
      .from("customers")
      .insert([{ name: customerName, phoneNo: customerPhone }]);

    if (error) {
      console.error("Klaida pridedant vartotoją:", error.message);
    } else {
      setCustomerName(""); // Išvalome laukelį
      setCustomerPhone(""); // Išvalome telefono laukelį
    }
  };

  const handleCustomerAdding = (e) => {
    e.preventDefault();
    console.log("Customer added:", customerName);
    addCustomer();
    setAddCustomerModalOpen(false);
  };

  return (
    <div
      onClick={() => setAddCustomerModalOpen(false)}
      style={style.modalOverlay}
    >
      <div onClick={(e) => e.stopPropagation()} style={style.modalContent}>
        <form style={style.formContent} onSubmit={handleCustomerAdding}>
          <div style={style.formInput}>
            <label htmlFor="customerName">Kliento vardas:</label> <br />
            <input
              id="customerName"
              placeholder="Kliento vardas"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={style.modalInput}
              minLength={3}
            />
            <label htmlFor="customerPhone">Telefono numeris:</label> <br />
            <input
              id="customerPhone"
              placeholder="Telefono numeris"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              style={style.modalInput}
              type="text"
              minLength={6}
            />
          </div>

          <div style={style.modalButtonsContainer}>
            <button type="submit" style={style.modalButton}>
              Pridėti klientą
            </button>
            <button
              type="button"
              style={style.modalButton}
              onClick={() => {
                setAddCustomerModalOpen(false);
              }}
            >
              Uždaryti
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddOrderModal;

const style = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    height: "30vh",
    width: "30vw",
    borderRadius: "20px",
    justifyContent: "space-around",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  },
  modalButtonsContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalButton: {
    backgroundColor: "#41bb7e",
    borderRadius: "20px",
    width: "30%",
    height: "50px",
    margin: "10px",
  },
  modalInput: {
    width: "80%",
    height: "40px",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "25px",
  },
  formContent: {
    margin: "7%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  formInput: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
};
