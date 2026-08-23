import { supabase } from "../supabaseClient";
import { useState, useEffect } from "react";
import SmallCard from "./UI/SmallCard";
import formStyles from "./UI/formStyles";
import { colors, space, text } from "../theme";

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
      <SmallCard key={car.id} header={car.car_name} addionalDetails={car.year} />
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
    <form style={formStyles.modal} onSubmit={handleCustomerChange}>
      <h2 style={formStyles.title}>Kliento informacija</h2>

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
          />
        </div>
      </div>

      <div style={styles.carsSection}>
        <h3 style={text.sectionTitle}>Automobiliai</h3>
        {cars.length === 0 ? (
          <p style={styles.emptyCars}>Automobilių dar nėra</p>
        ) : (
          <div style={styles.carsContainer}>{returnCarCards()}</div>
        )}
      </div>

      <div style={formStyles.buttonRow}>
        <button type="submit" className="app-btn app-btn-primary">
          Išsaugoti pakeitimus
        </button>
        <button
          type="button"
          className="app-btn app-btn-secondary"
          onClick={addAdditionalCar}
        >
          Pridėti automobilį
        </button>
        <button
          type="button"
          className="app-btn app-btn-secondary"
          onClick={() => setModal(false)}
        >
          Uždaryti
        </button>
      </div>
    </form>
  );
}

export default CustomerDetailedForm;

const styles = {
  carsSection: {
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    paddingTop: space.lg,
    borderTop: `1px solid ${colors.border}`,
  },
  carsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: space.sm,
  },
  emptyCars: {
    ...text.muted,
    margin: 0,
  },
};
