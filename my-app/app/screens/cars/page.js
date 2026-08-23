"use client";

import { supabase } from "./../../supabaseClient"; // Importuojame klientą
import { useState, useEffect } from "react";
import CustomButton from "../../components/UI/CustomButton";
import AddCustomerModal from "../../components/CustomerForm";
import ModalWrapper from "./../../components/ModalWrapper";
import CarCard from "./../../components/CarCard";

import Card from "./../../components/Card";
import CustomerForm from "./../../components/CustomerForm";
import CustomerDetailedForm from "./../../components/CustomerDetailedForm";
import CarForm from "./../../components/CarForm";
import Dropdown from "../../components/UI/Dropdown";

export default function cars({ children }) {
  const [cars, setCars] = useState([]);

  const fetchCars = async () => {
    const { data: cars, error } = await supabase.from("cars").select(`
      *,
      customers (*)
    `);

    if (error) {
      console.error("Error fetching cars:", error);
      return;
    }

    setCars(cars);
    console.log(cars);
  };

  useEffect(() => {
    fetchCars();
    console.log(cars);
  }, []);

  return (
    <div style={styles.root}>
      <div style={styles.content}>
        <h2>Cars Page</h2>
        {cars.map((car) => (
          <CarCard
            key={car.id}
            id={car.id}
            carName={car.car_name}
            customerName={car.customers.name}
            registrationNumber={car.registration_no}
            year={car.year}
            vin={car.vin}
            onClick={() => {}}
            onClickDelete={() => {}}
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
