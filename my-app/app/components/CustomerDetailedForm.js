import { supabase } from "../supabaseClient";
import { useState, useEffect } from "react";
import SmallCard from "./UI/SmallCard";

function CustomerDetailedForm({
  setModal,
  selectedCustomer,
  setSelectedCustomer,
  addAdditionalCar,
}) {
  const [customerName, setCustomerName] = useState(selectedCustomer.name);
  const [customerPhone, setCustomerPhone] = useState(
    selectedCustomer.phone_number == null ? "" : selectedCustomer.phone_number,
  );

  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .eq("user_id", selectedCustomer.id);

    if (error) {
      console.error("Klaida gaunant automobilius:", error.message);
    } else {
      setCars(data);
    }
  };

  const returnCarCards = () => {
    return cars.map((car) => (
      <SmallCard
        key={car.id}
        header={car.car_name}
        addionalDetails={car.year}
      />
    ));
  };

  const handleCustomerChange = async (e) => {
    e.preventDefault();

    if (selectedCustomer.id) {
      // UPDATE LOGIC
      try {
        const { error } = await supabase
          .from("customers")
          .update({
            name: customerName,
            phone_number: customerPhone,
          })
          .eq("id", selectedCustomer.id);

        if (error) throw error;

        setModal(false);
      } catch (error) {
        console.error("Error updating customer:", error.message);
        alert("Error updating customer: " + error.message);
      }
    } else {
      // ADD LOGIC (calls the original function passed from parent)
      await handleCustomerAdding(e);
    }
    setSelectedCustomer(null);
  };

  return (
    <form style={styles.formContent} onSubmit={handleCustomerChange}>
      <div style={styles.formInput}>
        <label htmlFor="customerName">Kliento vardas:</label>
        <input
          id="customerName"
          placeholder="Kliento vardas"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          style={styles.modalInput}
          minLength={3}
        />
        <label htmlFor="customerPhone">Telefono numeris:</label>
        <input
          id="customerPhone"
          placeholder="Telefono numeris"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          style={styles.modalInput}
          type="text"
          //   minLength={6}
        />
      </div>
      <h2 style={styles.carsHeader}>Automobiliai</h2>
      <div style={styles.carsContainer}>{returnCarCards()}</div>

      <div style={styles.modalButtonsContainer}>
        <button type="submit" style={styles.modalButton}>
          Išsaugoti pakeitimus
        </button>
        <button
          type="button"
          style={styles.modalButton}
          onClick={() => setModal(false)}
        >
          Uždaryti
        </button>
        <button
          type="button"
          style={styles.modalButton}
          onClick={addAdditionalCar}
        >
          Pridėti automobilį
        </button>
      </div>
    </form>
  );
}

export default CustomerDetailedForm;

const styles = {
  modalButtonsContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
  },
  modalButton: {
    borderRadius: "20px",
    width: "45%",
    height: "40px",
    margin: "5px",
  },
  modalInput: {
    width: "100%",
    height: "40px",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "18px",
    marginBottom: "10px",
  },
  formContent: {
    display: "flex",
    height: "100%",

    flexDirection: "column",
  },
  formInput: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  carsContainer: {
    display: "flex",
  },
  carsHeader: {
    textAlign: "center",
  },
};
