"use client";

import Dropdown from "./components/UI/Dropdown";
import { useState, useEffect } from "react";
import { button, Modal, Form } from "react-bootstrap";
import AddCustomerModal from "./components/CustomerForm";
import AddButtonsRow from "./components/UI/AddButtonsRow";
import { supabase } from "./supabaseClient"; // Importuojame klientą
import { AddCustomer } from "./services/customers";

export default function Home() {
  const [customers, setCustomers] = useState([]);
  const [cars, setCars] = useState([]);
  const [orders, setOrders] = useState([]);
  const [parts, setParts] = useState([]);

  const [showCustomerForm, setShowCustomerForm] = useState(true);
  const [step, setStep] = useState(1);
  const [custId, setCustId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Navigacijos funkcijos
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const [showOrderCreation, setShowOrderCreation] = useState(false);
  const fetchUsers = async () => {
    const { data, error } = await supabase.from("customers").select("*");

    if (error) {
      console.error("Klaida gaunant vartotojus:", error.message);
    } else {
      setCustomers(data);
      setCustId(data.length + 1);
    }
  };

  const fetchCars = async () => {
    const { data, error } = await supabase.from("cars").select("*");

    if (error) {
      console.error("Klaida gaunant automobilius:", error.message);
    } else {
      setCars(data);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCars();
  }, []);

  const handleAddingCustomer = (e) => {
    console.log("Customer added:", customerName);
    e.preventDefault();
    // AddCustomer(customerName, customerPhone);
    // setShowCustomerForm(false);
    console.log(step);
    nextStep();
    console.log(step);
  };

  const returnCustomerAddForm = () => {
    return (
      <form onSubmit={handleAddingCustomer} style={style.formContainer}>
        <div style={style.formInputContainer}>
          <label style={style.formLabel}>Vardas Pavarde</label>
          <input
            style={style.formInput}
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Jonas Jonaitis"
            minLength={3}
          />
          <label style={style.formLabel}>Telefono numeris</label>
          <input
            style={style.formInput}
            type="text"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="+37061234567"
          />
        </div>

        <div style={style.formButtonContainer}>
          <button type="submit" style={style.formButton}>
            Tęsti
          </button>
          <button
            type="button"
            style={style.formButton}
            onClick={() => {
              setShowCustomerForm(false);
            }}
          >
            Grįžti
          </button>
        </div>
      </form>
    );
  };

  const returnCarAddForm = () => {
    return (
      <form onSubmit={handleAddingCustomer} style={style.formContainer}>
        <div style={style.formInputContainer}>
          <label style={style.formLabel}>Vardas Pavarde</label>
          <input
            style={style.formInput}
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Jonas Jonaitis"
          />
        </div>

        <div style={style.formButtonContainer}>
          <button type="submit" style={style.formButton}>
            Tęsti
          </button>
          <button
            type="button"
            style={style.formButton}
            onClick={() => {
              prevStep();
            }}
          >
            Grįžti
          </button>
        </div>
      </form>
    );
  };

  return (
    <div style={style.root}>
      <div>
        <h2>Pagrindinis puslapis</h2>
        <AddButtonsRow />
      </div>

      <div style={style.content}>
        <h2>Naujas klientas</h2>

        {showCustomerForm &&
          ((step === 1 && returnCustomerAddForm()) ||
            (step === 2 && returnCarAddForm()))}
      </div>
    </div>
  );
}

const style = {
  root: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    // backgroundColor: "#9d4c19",
    width: "90%",
  },
  addButton: {
    borderRadius: "20px",
    margin: "10px",
    width: "200px",
    height: "50px",
    backgroundColor: "#41bb7e",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  content: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    // backgroundColor: "green",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  formContainer: {
    display: "flex",
    // flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: " #41bb7e",
    borderRadius: "20px",
    // height: "10vh",
    width: "50%",
    height: "40vh",
    marginTop: "10%",
  },

  formInnerContainer: {
    display: "flex",
    flexDirection: "column",
    // alignItems:"center",
    justifyContent: "space-between",
    height: "100%",
    width: "50%",
  },
  formLabel: {
    width: "50%",
    margin: "10px",
    textAlign: "center",
    fontWeight: "bold",
  },
  formInput: {
    width: "50%",
    margin: "10px",
    textAlign: "center",
    borderRadius: "20px",
  },

  formButtonContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  formButton: {
    borderRadius: "20px",
    width: "30%",
    height: "50px",
    margin: "10px",
  },
  formInputContainer: {
    display: "flex",
    flex: 1,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
};
