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
};

export default function orders({ children }) {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState(null);

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

  return (
    <div style={layout.page}>
      <div style={layout.header}>
        <div>
          <h1 style={text.pageTitle}>Užsakymai</h1>
          <p style={styles.subtitle}>
            {orders.length} {orders.length === 1 ? "užsakymas" : "užsakymai"}
          </p>
          <span style={{ ...styles.statusBadge, ...getStatusStyle("Active") }}>
            {"Vykdomas"}
          </span>
          <span
            style={{
              ...styles.statusBadge,
              ...getStatusStyle("Waiting for parts"),
            }}
          >
            {"Laukia dalių"}
          </span>
          <span
            style={{ ...styles.statusBadge, ...getStatusStyle("Finished") }}
          >
            {"Baigtas"}
          </span>
        </div>
        <Dropdown />
      </div>

      <div style={layout.list}>
        {orders.length === 0 ? (
          <p style={layout.emptyState}>Užsakymų dar nėra</p>
        ) : (
          orders.map((order) => (
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
};
