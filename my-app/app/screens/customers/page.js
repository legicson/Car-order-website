"use client";

import { supabase } from "./../../supabaseClient"; // Importuojame klientą
import { useState, useEffect } from "react";
import CustomButton from "../../components/UI/CustomButton";
import Dropdown from "../../components/UI/Dropdown";

import { layout, space } from "../../theme";
import CustomerCard from "../../components/cards/CustomerCard";

import AddCustomerForm from "../../components/forms/AddCustomerForm";
import NewCustomerFlow from "../../components/forms/NewCustomerFlow";

export default function Customers({ children }) {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showEditCustomerForm, setShowEditCustomerForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const resetValues = () => {
    setCustomerName("");
    setCustomerPhone("");
    setShowCustomerForm(false);
    setShowEditCustomerForm(false);
    setSelectedCustomer(null);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);
  async function fetchCustomers() {
    const { data: customers, error } = await supabase.from("customers").select(`
      *,
      cars (*)
    `);

    if (error) {
      console.error("Error fetching customers:", error);
      return;
    }

    setCustomers(customers);
  }

  const query = search.trim().toLowerCase();
  const filteredCustomers = query
    ? customers.filter((customer) => {
        const name = String(customer.name ?? "").toLowerCase();
        const phone = String(customer.phone_number ?? "").toLowerCase();

        return name.includes(query) || phone.includes(query);
      })
    : customers;

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone_number ?? "");
    setShowEditCustomerForm(true);
  };

  const handleEditCustomer = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("customers")
      .update({
        name: customerName,
        phone_number: customerPhone,
      })
      .eq("id", selectedCustomer.id);

    if (error) {
      console.error("Klaida redaguojant klientą:", error.message);
    } else {
      fetchCustomers();
      setShowEditCustomerForm(false);
      resetValues();
    }
  };
  return (
    <div style={layout.page}>
      <div style={layout.header}>
        <h2>Customers</h2>
        <Dropdown />
        <div style={styles.toolbar}>
          <CustomButton
            ButtonText="Pridėti klientą"
            onClick={() => setShowCustomerForm(true)}
          />
          {customers.length > 0 && (
            <div style={styles.searchWrapper}>
              <input
                className="app-input"
                style={styles.searchInput}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ieškoti pagal vardą arba telefono numerį"
                aria-label="Ieškoti klientų"
              />
              {search && (
                <button
                  type="button"
                  className="app-icon-btn"
                  style={styles.clearButton}
                  onClick={() => setSearch("")}
                  aria-label="Išvalyti paiešką"
                >
                  &times;
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div style={{ ...layout.content, ...styles.content }}>
        {showCustomerForm && (
          <NewCustomerFlow
            showCustomerForm={showCustomerForm}
            setShowCustomerForm={setShowCustomerForm}
            fetchCustomers={fetchCustomers}
            fetchCars={() => {}}
          />
        )}

        {showEditCustomerForm && (
          <AddCustomerForm
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            handleContinueClick={handleEditCustomer}
            setShowCustomerForm={setShowCustomerForm}
            resetValues={resetValues}
            submitText={"Išsaugoti"}
          />
        )}
        {showCustomerForm === false &&
          !showEditCustomerForm &&
          filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customerName={customer.name}
              phoneNumber={customer.phone_number}
              cars={customer.cars}
              onClick={() => {
                handleCustomerClick(customer);
              }}
              onClickDelete={() => {}}
            />
          ))}
      </div>
    </div>
  );
}

const styles = {
  toolbar: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: space.md,
    width: "100%",
  },
  searchWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    flex: "1 1 260px",
    maxWidth: "450px",
  },
  searchInput: {
    paddingRight: "40px",
  },
  clearButton: {
    position: "absolute",
    right: "4px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
};
