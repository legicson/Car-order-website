"use client";

import { supabase } from "./../../supabaseClient"; // Importuojame klientą
import { useState, useEffect } from "react";
import CustomButton from "../../components/UI/CustomButton";
import ModalWrapper from "./../../components/ModalWrapper";
import Dropdown from "../../components/UI/Dropdown";

import Card from "./../../components/Card";
import CustomerForm from "./../../components/CustomerForm";
import CarForm from "./../../components/CarForm";
import CustomerDetailedForm from "./../../components/CustomerDetailedForm";
import { layout, space, text } from "../../theme";
import CustomerCard from "../../components/CustomerCard";

export default function Customers({ children }) {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

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

  return (
    <div style={layout.page}>
      <div style={layout.header}>
        <h2>Customers</h2>
        <Dropdown />
        <div style={styles.toolbar}>
          <CustomButton ButtonText="Pridėti klientą" onClick={() => {}} />
          {customers.length > 0 && (
            <div style={styles.searchWrapper}>
              <input
                className="app-input"
                style={styles.searchInput}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ieškoti pagal pavadinimą arba kodą"
                aria-label="Ieškoti dalių"
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
      <div style={layout.list}>
        {filteredCustomers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customerName={customer.name}
            phoneNumber={customer.phone_number}
            cars={customer.cars}
            onClick={() => {}}
            onClickDelete={() => {}}
          />
        ))}
      </div>
    </div>
  );
}

const styles = {
  subtitle: {
    ...text.muted,
    margin: "4px 0 0",
  },
  formWrapper: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
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
    maxWidth: "420px",
  },
  searchInput: {
    paddingRight: "40px",
  },
  clearButton: {
    position: "absolute",
    right: "4px",
  },
};
