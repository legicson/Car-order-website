"use client";

import Dropdown from "./components/UI/Dropdown";
import { useState, useEffect } from "react";
import AddButtonsRow from "./components/UI/AddButtonsRow";
import { supabase } from "./supabaseClient"; // Importuojame klientą
import Card from "./components/Card";
import { useRouter } from "next/navigation";
import AddCustomerForm from "./components/AddCustomerForm";
import AddPartForm from "./components/AddPartForm";
import CarAddForm from "./components/CarAddForm";
import { layout, text } from "./theme";
import NewPartFlow from "./components/NewPartFlow";
import NewCustomerFlow from "./components/NewCustomerFlow";
import OrderCard from "./components/OrderCard";

export default function Home() {
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [cars, setCars] = useState([]);
  const [orders, setOrders] = useState([]);

  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [step, setStep] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [carName, setCarName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [year, setYear] = useState("");
  const [commnent, setCommnent] = useState("");

  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [showCarForm, setShowCarForm] = useState(false);

  const [showPartForm, setShowPartForm] = useState(false);
  const [partName, setPartName] = useState("");
  const [partPrice, setPartPrice] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [replacementCode, setReplacementCode] = useState("");
  const [profitPercentage, setProfitPercentage] = useState("");

  const resetValues = () => {
    setCustomerName("");
    setCustomerPhone("");
    setCarName("");
    setRegistrationNumber("");
    setYear("");
    setCommnent("");
    setSelectedCustomer(null);
    setStep(1);
    setShowCustomerForm(false);
    setShowCarForm(false);
    setShowPartForm(false);
    setPartName("");
    setPartPrice("");
    setPartNumber("");
    setReplacementCode("");
    setProfitPercentage("");
  };

  // Navigacijos funkcijos
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
      *,
      order_items (
        *,
        parts (*)
      ),
      cars (
        *,
        customers (*)
      )
    `,
      )
      .in("status", ["Active", "Waiting for parts"]);

    if (error) {
      console.error("Error fetching all orders:", error);
      return null;
    }

    setOrders(
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    );
  }

  const fetchCustomers = async () => {
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
        comment: commnent,
      },
    ]);

    if (error) {
      console.error("Klaida pridedant automobilį:", error.message);
    }
  };

  const addOrder = async (car) => {
    if (!car) return;

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          car_id: car.id,
          status: "Active",
          mileage: "0",
          labor: "0",
        },
      ])
      .select();

    if (error) {
      console.error("Klaida pridedant uzsakyma:", error.message);
    } else {
      return data[0].id;
    }
  };

  const addPart = async () => {
    if (!partName.trim()) return;
    const normalizedPrice = parseFloat(String(partPrice).replace(",", "."));
    const { error } = await supabase.from("parts").insert([
      {
        partName: partName,
        price: normalizedPrice,
        partNumber: partNumber,
        replacement_code: replacementCode,
        profit_percentage: profitPercentage,
      },
    ]);

    if (error) {
      console.error("Klaida pridedant dali:", error.message);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchCars();
    fetchOrders();
  }, []);

  const handlePartAdding = (e) => {
    e.preventDefault();
    addPart();
    resetValues();
  };

  const handleContinueClick = (e) => {
    e.preventDefault();
    nextStep();
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
      fetchCars();
      resetValues();
    } else {
      console.log("Nepavyko prideti kliento");
    }
  };

  const returnSelectableCustomerList = () => {
    return (
      <div style={style.picker}>
        <h2 style={style.pickerTitle}>
          {showOrderForm
            ? "Pasirinkite klientą naujam užsakymui"
            : "Pasirinkite klientą, kuriam norite pridėti automobilį"}
        </h2>
        <div style={style.pickerActions}>
          <button
            type="button"
            className="app-btn app-btn-secondary"
            onClick={() => {
              setShowOrderForm(false);
              resetValues();
            }}
          >
            Atšaukti
          </button>
        </div>
        <div style={layout.list}>
          {customers.map((customer) => (
            <Card
              key={customer.id}
              id={customer.id}
              header={customer.name}
              addionalDetails={customer.phone_number}
              onClick={() => onClickSetSelectedCustomer(customer)}
            />
          ))}
        </div>
      </div>
    );
  };

  const onClickSetSelectedCustomer = (item) => {
    setSelectedCustomer(item);
    nextStep();
  };

  const onClickSetSelectedCar = async (item) => {
    const orderId = await addOrder(item);
    setShowOrderForm(false);
    resetValues();
    router.push(`/screens/orders/${orderId}`);
  };

  const returnCarListForOrder = () => {
    if (!selectedCustomer) return null;
    const customerCars = cars.filter(
      (car) => car.user_id === selectedCustomer.id,
    );
    return (
      <div style={style.picker}>
        <h2 style={style.pickerTitle}>Pasirinkite automobilį</h2>

        <div style={layout.list}>
          {customerCars.length === 0 ? (
            <p style={layout.emptyState}>
              Šis klientas dar neturi pridėtų automobilių
            </p>
          ) : (
            customerCars.map((car) => (
              <Card
                key={car.id}
                id={car.id}
                header={car.car_name}
                addionalDetails={car.registration_no}
                onClick={() => {
                  onClickSetSelectedCar(car);
                }}
              />
            ))
          )}
        </div>

        <div style={style.pickerActions}>
          <button
            type="button"
            className="app-btn app-btn-secondary"
            onClick={() => {
              prevStep();
            }}
          >
            Grįžti
          </button>
          <button
            type="button"
            className="app-btn app-btn-secondary"
            onClick={() => {
              setShowOrderForm(false);
              resetValues();
            }}
          >
            Atšaukti
          </button>
        </div>
      </div>
    );
  };

  const onClickSetSelectedOrder = async (orderId) => {
    router.push(`/screens/orders/${orderId}?origin=main`);
  };
  const toAmount = (value) => Number(value) || 0;
  const calculateOrderTotalPrice = (order) => {
    return order.order_items.reduce(
      (sum, item) => sum + item.quantity * toAmount(item.price_at_sale),
      0,
    );
  };

  const calculateOrderTotalIncome = (order) => {
    const total = order.order_items.reduce(
      (sum, item) =>
        sum + item.quantity * toAmount(item.retail_price ?? item.price_at_sale),
      0,
    );

    return total + toAmount(order.labor);
  };

  return (
    <div style={layout.page}>
      {!showOrderForm && !showCustomerForm && !showCarForm && !showPartForm && (
        <>
          <div style={layout.header}>
            <div>
              <h1 style={text.pageTitle}>Pagrindinis puslapis</h1>
              <p style={style.subtitle}>
                Sukurkite užsakymą arba papildykite serviso duomenis
              </p>
            </div>
            <Dropdown />
          </div>

          <AddButtonsRow
            setAddCustomerModalOpen={setShowCustomerForm}
            setAddOrderModalOpen={setShowOrderForm}
            setAddCarModalOpen={setShowCarForm}
            setAddPartModalOpen={setShowPartForm}
          />
        </>
      )}

      <div style={{ ...layout.content, ...style.content }}>
        {!showOrderForm &&
          !showCustomerForm &&
          !showCarForm &&
          !showPartForm &&
          (orders.length === 0 ? (
            <p>Užsakymų dar nėra</p>
          ) : (
            orders.map((order) => (
              <OrderCard
                key={order.id}
                id={order.id}
                customerName={order.cars.customers.name}
                carName={order.cars.car_name}
                createdAt={order.created_at}
                costOfGoods={order.cost_of_goods}
                income={order.income}
                status={order.status}
                onClick={() => onClickSetSelectedOrder(order.id)}
                onDelete={() => {}}
                totalPrice={calculateOrderTotalPrice(order)}
                totalRevenue={calculateOrderTotalIncome(order)}
                mileage={order.mileage}
              />
            ))
          ))}

        {showPartForm && (
          <NewPartFlow
            showPartForm={showPartForm}
            setShowPartForm={setShowPartForm}
            fetchParts={() => {}}
          />
        )}

        {showCarForm &&
          ((step === 1 && returnSelectableCustomerList()) ||
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
                commnent={commnent}
                setCommnent={setCommnent}
              />
            )))}

        {showOrderForm &&
          ((step === 1 && returnSelectableCustomerList()) ||
            (step === 2 && returnCarListForOrder()))}

        {showCustomerForm && (
          <NewCustomerFlow
            showCustomerForm={showCustomerForm}
            setShowCustomerForm={setShowCustomerForm}
            fetchCustomers={() => {}}
            fetchCars={() => {}}
          />
        )}
      </div>
    </div>
  );
}

const style = {
  subtitle: {
    ...text.muted,
    margin: "4px 0 0",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  picker: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
    maxWidth: "80%",
  },
  pickerTitle: {
    ...text.pageTitle,
    fontSize: "1.35rem",
  },
  pickerActions: {
    display: "flex",
    gap: "8px",
  },
};
