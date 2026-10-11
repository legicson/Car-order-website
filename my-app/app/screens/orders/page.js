"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Importuojame klientą
import OrderCard from "../../components/cards/OrderCard";
import { layout, text, colors } from "../../theme";
import SearchInput from "../../components/UI/SearchInput";
import CustomButton from "../../components/UI/CustomButton";
import { useRouter } from "next/navigation";
import Card from "../../components/cards/Card";

const STATUS_COLORS = {
  Active: { color: colors.warning, backgroundColor: colors.warningSoft },
  Finished: { color: colors.success, backgroundColor: colors.successSoft },
  "Waiting for parts": {
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  All: { color: colors.accent, backgroundColor: colors.accentSoft },
};

const STATUS_FILTERS = [
  { value: "All", label: "Visi" },
  { value: "Active", label: "Vykdomi" },
  { value: "Waiting for parts", label: "Laukia dalių" },
  { value: "Finished", label: "Baigti" },
];

export default function orders({ children }) {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [cars, setCars] = useState([]);

  // Navigacijos funkcijos
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  const resetValues = () => {
    setSelectedCustomer(null);
    setStep(1);
  };
  async function fetchOrders() {
    const { data, error } = await supabase.from("orders").select(`
      *,
      order_items (
        *,
        parts (*)
      ),
      labor_items (*),
      cars (
        *,
        customers (*)
      )
    `);

    if (error) {
      console.error("Error fetching all orders:", error);
      return null;
    }

    setOrders(
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    );
  }

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

  const getStatusStyle = (status) =>
    STATUS_COLORS[status] ?? {
      color: colors.accent,
      backgroundColor: colors.accentSoft,
    };

  useEffect(() => {
    fetchOrders();
    fetchUsers();
    fetchCars();
  }, []);

  // Both totals stay numbers so OrderCard can subtract them; the card's
  // formatMoney adds the euro sign.
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

    const labor = (order.labor_items || []).reduce(
      (sum, item) => sum + toAmount(item.price),
      0,
    );

    return total + labor;
  };

  const filteredOrdersByStatus =
    status === "All"
      ? orders
      : orders.filter((order) => order.status === status);

  const query = search.trim().toLowerCase();
  const filteredOrders = query
    ? filteredOrdersByStatus.filter((order) => {
        const name = String(order.cars.customers.name ?? "").toLowerCase();
        const car = String(order.cars.car_name ?? "").toLowerCase();

        return name.includes(query) || car.includes(query);
      })
    : filteredOrdersByStatus;

  const onClickSetSelectedOrder = async (orderId) => {
    router.push(`/screens/orders/${orderId}`);
  };

  const returnSelectableCustomerList = () => {
    return (
      <div style={layout.picker}>
        <div style={layout.pickerHeader}>
          <div>
            <h2 style={layout.pickerTitle}>
              Pasirinkite klientą naujam užsakymui
            </h2>
            <p style={layout.subtitle}>1 žingsnis iš 2</p>
          </div>
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

  const returnCarListForOrder = () => {
    if (!selectedCustomer) return null;
    const customerCars = cars.filter(
      (car) => car.user_id === selectedCustomer.id,
    );
    return (
      <div style={layout.picker}>
        <div style={layout.pickerHeader}>
          <div>
            <h2 style={layout.pickerTitle}>Pasirinkite automobilį</h2>
            <p style={layout.subtitle}>
              2 žingsnis iš 2 · {selectedCustomer.name}
            </p>
          </div>
          <div style={styles.pickerActions}>
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

  const addOrder = async (car) => {
    if (!car) return;

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          car_id: car.id,
          status: "Active",
          mileage: "0",
        },
      ])
      .select();

    if (error) {
      console.error("Klaida pridedant uzsakyma:", error.message);
    } else {
      return data[0].id;
    }
  };
  const countFor = (value) =>
    value === "All"
      ? orders.length
      : orders.filter((order) => order.status === value).length;

  return (
    <div className="app-page" style={layout.page}>
      {!showOrderForm && (
        <>
          <div style={layout.header}>
            <div>
              <h1 style={text.pageTitle}>Užsakymai</h1>
              <p style={layout.subtitle}>
                {query || status !== "All"
                  ? `Rodoma ${filteredOrders.length} iš ${orders.length}`
                  : `${orders.length} ${orders.length === 1 ? "užsakymas" : "užsakymai"}`}
              </p>
            </div>
            <CustomButton
              ButtonText="+ Sukurti užsakymą"
              onClick={() => setShowOrderForm(true)}
            />
          </div>

          <div style={layout.toolbar}>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Ieškoti pagal vardą arba automobilį"
              label="Ieškoti užsakymų"
            />
            <div style={styles.chips} role="group" aria-label="Filtruoti pagal statusą">
              {STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  className={`app-chip${status === filter.value ? " is-active" : ""}`}
                  aria-pressed={status === filter.value}
                  onClick={() => setStatus(filter.value)}
                >
                  {filter.value !== "All" && (
                    <span
                      className="app-chip-dot"
                      style={{ backgroundColor: getStatusStyle(filter.value).color }}
                    />
                  )}
                  {filter.label}
                  <span className="app-chip-count">{countFor(filter.value)}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div style={layout.content}>
        {!showOrderForm &&
          (filteredOrders.length === 0 ? (
            <p style={layout.emptyState}>
              {orders.length === 0
                ? "Užsakymų dar nėra"
                : "Pagal pasirinktus filtrus užsakymų nerasta"}
            </p>
          ) : (
            filteredOrders.map((order) => (
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

        {showOrderForm &&
          ((step === 1 && returnSelectableCustomerList()) ||
            (step === 2 && returnCarListForOrder()))}
      </div>
    </div>
  );
}

const styles = {
  chips: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  pickerActions: {
    display: "flex",
    gap: "8px",
  },
};
