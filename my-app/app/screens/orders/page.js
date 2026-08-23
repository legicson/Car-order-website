"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Importuojame klientą
import OrderCard from "../../components/OrderCard";
import Dropdown from "../../components/UI/Dropdown";
import { layout, text } from "../../theme";

export default function orders({ children }) {
  const [orders, setOrders] = useState([]);

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

    setOrders(data);
  }

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
};
