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

import AddCustomerForm from "../../components/AddCustomerForm";
import CarAddForm from "../../components/CarAddForm";

export default function Customers({ children }) {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [carName, setCarName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [year, setYear] = useState("");
  const [step, setStep] = useState(1);
  const [showCarForm, setShowCarForm] = useState(false);

  const resetValues = () => {
    setCustomerName("");
    setCustomerPhone("");
    setCarName("");
    setRegistrationNumber("");
    setYear("");
    setShowCustomerForm(false);
    setStep(1);
  };

  const handleContinueClick = () => {
    if (customerName.trim() === "") {
      alert("Prašome užpildyti visus laukus.");
      return;
    }
    setStep(2);
  };
  const addCustomer = async () => {
    if (!customerName.trim()) return;

    const { data, error } = await supabase
      .from("customers")
      .insert([
        {
          name: customerName,
          phone_number: customerPhone,
        },
      ])
      .select();

    if (error) {
      console.error("Klaida pridedant vartotoją:", error.message);
    } else {
      return data[0].id;
    }
  };

  const addCar = async (newCustomerId) => {
    if (!carName.trim()) return;

    const { error } = await supabase.from("cars").insert([
      {
        car_name: carName,
        registration_no: registrationNumber,
        year: year,
        user_id: newCustomerId,
      },
    ]);

    if (error) {
      console.error("Klaida pridedant automobilį:", error.message);
    }
  };
  const handleAddingCarCustomer = async (e) => {
    e.preventDefault();

    let newCustomerId;
    if (showCarForm) {
      newCustomerId = selectedCustomer.id;
    } else {
      newCustomerId = await addCustomer();
    }

    if (newCustomerId) {
      await addCar(newCustomerId);
      fetchCustomers();
      // fetchCars();
      resetValues();
    } else {
      console.log("Nepavyko prideti kliento");
    }
  };

  const prevStep = () => {
    setStep(1);
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
        {showCustomerForm &&
          ((step === 1 && (
            <AddCustomerForm
              customerName={customerName}
              setCustomerName={setCustomerName}
              customerPhone={customerPhone}
              setCustomerPhone={setCustomerPhone}
              handleContinueClick={handleContinueClick}
              setShowCustomerForm={setShowCustomerForm}
              resetValues={resetValues}
            />
          )) ||
            (step === 2 && (
              <CarAddForm
                carName={carName}
                setCarName={setCarName}
                registrationNumber={registrationNumber}
                setRegistrationNumber={setRegistrationNumber}
                year={year}
                setYear={setYear}
                handleAddingCarCustomer={handleAddingCarCustomer}
                prevStep={prevStep}
              />
            )))}

        {showCustomerForm === false &&
          filteredCustomers.map((customer) => (
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
