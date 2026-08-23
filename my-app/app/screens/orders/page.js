"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient"; // Importuojame klientą
import OrderCard from "../../components/OrderCard";
import Dropdown from "../../components/UI/Dropdown";

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
    <div style={styles.root}>
      <h1>Orders Page</h1>
      <Dropdown />
      <div style={styles.content}>
        {orders.map((order) => (
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
        ))}
      </div>
    </div>
  );
}

const styles = {
  root: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    // backgroundColor: "#9d4c19",
    width: "90%",
  },

  content: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    // backgroundColor: "green",
    justifyContent: "flex-start",
    alignItems: "center",
  },
};
