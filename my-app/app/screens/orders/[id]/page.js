"use client";
import { supabase } from "./../../../supabaseClient"; // Importuojame klientą
import { use, useState, useEffect } from "react";

export default function orderList({ params }) {
  const { id } = use(params);
  const [car, setCar] = useState(null);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
    id,
    created_at,
    total_price,
    income,
    status,
    car:cars (
      id,
      car_name,
      registration_no,
      year,
      customer:customers (
        id,
        name,
        phone_number,
        creation_date
      )
    )
  `,
      )
      .eq("id", id)
      .single();

    if (error) {
      console.log(error);
    } else {
      setCar(data.car);
      setCustomer(data.car.customer);
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Order List {id}</h1>
      <button onClick={() => console.log(car, customer)}>Log Details</button>
    </div>
  );
}
