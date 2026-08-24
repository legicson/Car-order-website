"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Importuojame klientą
import OrderCard from "../../components/OrderCard";
import Dropdown from "../../components/UI/Dropdown";
import { layout, text, colors, radius } from "../../theme";

const STATUS_COLORS = {
  Active: { color: colors.warning, backgroundColor: colors.warningSoft },
  // Active: { color: colors.warning, backgroundColor: colors.warningSoft },
  Finished: { color: colors.success, backgroundColor: colors.successSoft },
  "Waiting for parts": {
    color: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  All: { color: colors.accent, backgroundColor: colors.accentSoft },
};

export default function orders({ children }) {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("Active");
  const [search, setSearch] = useState("");

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

  const getStatusStyle = (status) =>
    STATUS_COLORS[status] ?? {
      color: colors.accent,
      backgroundColor: colors.accentSoft,
    };

  useEffect(() => {
    fetchOrders();
  }, []);

  const calculateOrderTotalPrice = (order) => {
    const total = order.order_items.reduce(
      (sum, item) => sum + item.quantity * item.price_at_sale,
      0,
    );

    return total.toFixed(2);
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

      <div style={layout.list}>
        {filteredOrders.length === 0 ? (
          <p style={layout.emptyState}>Užsakymų dar nėra</p>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              id={order.id}
              customerName={order.cars.customers.name}
              carName={order.cars.car_name}
              createdAt={order.created_at}
              income={order.income}
              status={order.status}
              onClick={() => {}}
              onDelete={() => {}}
              totalPrice={calculateOrderTotalPrice(order)}
            />
          ))
        )}
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
    // max-width: "100px",
    // textAlign: "center",
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
    // width: "50%",
    flex: 1,
    // backgroundColor: "green",
    justifyContent: "space-between",
  },
  searchWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    flex: "1 1 260px",
    maxWidth: "420px",
  },
  searchContainer: {
    display: "flex",
    justifyContent: "space-between",
    // alignItems: "center",
    width: "100%",
  },
};
