"use client";

import Dropdown from "./components/UI/Dropdown";
import { useState, useEffect } from "react";
import { button, Modal, Form } from "react-bootstrap";
import AddCustomerModal from "./components/CustomerForm";
import AddButtonsRow from "./components/UI/AddButtonsRow";
import { supabase } from "./supabaseClient"; // Importuojame klientą
import { AddCustomer } from "./services/customers";
import Card from "./components/Card";

export default function Home() {
  const [customers, setCustomers] = useState([]);
  const [cars, setCars] = useState([]);
  const [orders, setOrders] = useState([]);
  const [parts, setParts] = useState([]);

  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [step, setStep] = useState(1);
  const [custId, setCustId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [carName, setCarName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [year, setYear] = useState("");
  const [vin, setVin] = useState("");

  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);

  const resetValues = () => {
    setCustId("");
    setCustomerName("");
    setCustomerPhone("");
    setCarName("");
    setRegistrationNumber("");
    setYear("");
    setVin("");
    setSelectedCustomer(null);
    setStep(1);
  };

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
      console.log("Vartotojas pridedas");
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
    } else {
      console.log("Automobilis pridedas");
    }
  };

  const addOrder = async (car) => {
    if (!car) return;

    const { error } = await supabase.from("orders").insert([
      {
        car_id: car.id,
        income: 0,
        total_price: 0,
        status: "Active",
      },
    ]);

    if (error) {
      console.error("Klaida pridedant uzsakyma:", error.message);
    } else {
      console.log("Uzsakymas sukurtas");
    }
  };
  useEffect(() => {
    fetchUsers();
    fetchCars();
  }, []);

  const handleContinueClick = (e) => {
    e.preventDefault();
    nextStep();
  };

  const handleAddingCarCustomer = async (e) => {
    e.preventDefault();

    const newCustomerId = await addCustomer();
    if (newCustomerId) {
      await addCar(newCustomerId);
      fetchUsers();
      fetchCars();
      resetValues();
      setShowCustomerForm(false);
    } else {
      console.log("Nepavyko prideti kliento");
    }
  };

  const returnCustomerAddForm = () => {
    return (
      <form onSubmit={handleContinueClick} style={style.formContainer}>
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
              resetValues();
            }}
          >
            Grįžti
          </button>
        </div>
      </form>
    );
  };

  const returnCarAddForm = () => {
    const customerCars = cars.filter(
      (car) => car.user_id === selectedCustomer.id,
    );
  };

  const returnCustomerListForOrder = () => {
    return (
      <>
        <h2>Pasirinkite klientą naujam užsakymui</h2>
        {customers.map((customer) => (
          <div style={style.listContainer} key={customer.id}>
            <Card
              id={customer.id}
              header={customer.name}
              addionalDetails={customer.phone_number}
              onClick={() => onClickSetSelectedCustomer(customer)}
            />
          </div>
        ))}
        <button
          type="button"
          style={style.formButton}
          onClick={() => {
            setShowOrderForm(false);
            resetValues();
          }}
        >
          Atšaukti
        </button>
      </>
    );
  };

  const onClickSetSelectedCustomer = (item) => {
    setSelectedCustomer(item);
    nextStep();
  };

  const onClickSetSelectedCar = (item) => {
    addOrder(item);
    setShowOrderForm(false);
    resetValues();
  };

  const returnCarListForOrder = () => {
    if (!selectedCustomer) return null;
    const customerCars = cars.filter(
      (car) => car.user_id === selectedCustomer.id,
    );
    return (
      <>
        <h2>Pasirinkite automobilį</h2>
        {customerCars.map((car) => (
          <div style={style.listContainer} key={car.id}>
            <Card
              id={car.id}
              header={car.car_name}
              addionalDetails={car.registration_no}
              onClick={() => {
                onClickSetSelectedCar(car);
              }}
            />
          </div>
        ))}
        <button
          type="button"
          style={style.formButton}
          onClick={() => {
            prevStep();
          }}
        >
          Grįžti
        </button>
        <button
          type="button"
          style={style.formButton}
          onClick={() => {
            setShowOrderForm(false);
            resetValues();
          }}
        >
          Atšaukti
        </button>
      </>
    );
  };

  return (
    <div style={style.root}>
      <div>
        {!showOrderForm && !showCustomerForm && (
          <AddButtonsRow
            setAddCustomerModalOpen={setShowCustomerForm}
            setAddOrderModalOpen={setShowOrderForm}
          />
        )}
      </div>

      <div style={style.content}>
        {showOrderForm &&
          ((step === 1 && returnCustomerListForOrder()) ||
            (step === 2 && returnCarListForOrder()))}

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
  listContainer: {
    width: "100%",
  },
};
