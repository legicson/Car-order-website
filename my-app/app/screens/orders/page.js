"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Importuojame klientą
import OrderCard from "../../components/cards/OrderCard";
import Dropdown from "../../components/UI/Dropdown";
import { layout, text, colors, radius } from "../../theme";
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

    return total + toAmount(order.labor);
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
      <div style={styles.picker}>
        <h2 style={styles.pickerTitle}>
          {showOrderForm
            ? "Pasirinkite klientą naujam užsakymui"
            : "Pasirinkite klientą, kuriam norite pridėti automobilį"}
        </h2>
        <div style={styles.pickerActions}>
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
      <div style={styles.picker}>
        <h2 style={styles.pickerTitle}>Pasirinkite automobilį</h2>
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
  return (
    <div style={layout.page}>
      <div style={layout.header}>
        <div style={{ flex: 1 }}>
          <h1 style={text.pageTitle}>Užsakymai</h1>
          <p style={styles.subtitle}>
            {orders.length} {orders.length === 1 ? "užsakymas" : "užsakymai"}
          </p>

          <div style={styles.searchContainer}>
            <div style={styles.searchWrapper}>
              <CustomButton
                ButtonText="Sukurti užsakymą"
                onClick={() => setShowOrderForm(true)}
              />
              <input
                className="app-input"
                style={styles.searchInput}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ieškoti pagal vardą arba automobilį"
                aria-label="Ieškoti užsakymų"
              />
              {search && (
                <button
                  type="button"
                  className="app-icon-btn"
                  onClick={() => setSearch("")}
                  aria-label="Išvalyti paiešką"
                >
                  &times;
                </button>
              )}
            </div>

            <div style={styles.searchStatusWrapper}>
              <div
                onClick={() => setStatus("Active")}
                style={{
                  ...styles.statusBadge,
                  ...getStatusStyle("Active"),
                  ...styles.statusFilter,
                }}
              >
                {"Vykdomas"}
              </div>
              <div
                style={{
                  ...styles.statusBadge,
                  ...getStatusStyle("Waiting for parts"),
                  ...styles.statusFilter,
                }}
                onClick={() => setStatus("Waiting for parts")}
              >
                {"Laukia dalių"}
              </div>
              <div
                style={{
                  ...styles.statusBadge,
                  ...getStatusStyle("Finished"),
                  ...styles.statusFilter,
                }}
                onClick={() => setStatus("Finished")}
              >
                {"Baigtas"}
              </div>
              <div
                style={{
                  ...styles.statusBadge,
                  ...getStatusStyle("All"),
                  ...styles.statusFilter,
                }}
                onClick={() => setStatus("All")}
              >
                {"Visi"}
              </div>
            </div>
          </div>
        </div>
        <Dropdown />
      </div>

      <div style={layout.content}>
        {!showOrderForm &&
          (filteredOrders.length === 0 ? (
            <p style={layout.emptyState}>Užsakymų dar nėra</p>
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
  subtitle: {
    ...text.muted,
    margin: "4px 0 0",
  },
  statusBadge: {
    padding: "5px 12px",
    borderRadius: radius.pill,
    fontSize: "0.8rem",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  statusFilter: {
    display: "flex",
    flex: "1",
    border: `2px solid ${colors.border}`,
    marginLeft: "2%",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    cursor: "pointer",
  },
  searchStatusWrapper: {
    display: "flex",
    flex: 1,
    justifyContent: "space-between",
  },
  searchWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    flex: "1 1 260px",
    maxWidth: "450px",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  searchInput: {
    marginLeft: "10px",
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
