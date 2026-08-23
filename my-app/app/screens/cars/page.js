"use client";

import { supabase } from "./../../supabaseClient"; // Importuojame klientą
import { useState, useEffect } from "react";
import CarCard from "./../../components/CarCard";
import Dropdown from "../../components/UI/Dropdown";
import SearchInput from "../../components/UI/SearchInput";
import { layout, space, text } from "../../theme";

export default function cars({ children }) {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");

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
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const query = search.trim().toLowerCase();

  const filteredCars = query
    ? cars.filter((car) =>
        [
          car.car_name,
          car.registration_no,
          car.vin,
          car.year,
          car.customers?.name,
        ].some((field) => String(field ?? "").toLowerCase().includes(query)),
      )
    : cars;

  return (
    <div style={layout.page}>
      <div style={layout.header}>
        <div>
          <h1 style={text.pageTitle}>Automobiliai</h1>
          <p style={styles.subtitle}>
            {query
              ? `Rasta ${filteredCars.length} iš ${cars.length}`
              : `${cars.length} ${cars.length === 1 ? "automobilis" : "automobiliai"}`}
          </p>
        </div>
        <Dropdown />
      </div>

      {cars.length > 0 && (
        <div style={styles.toolbar}>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Ieškoti pagal markę, numerį, VIN, metus ar klientą"
            label="Ieškoti automobilių"
          />
        </div>
      )}

      <div style={layout.list}>
        {cars.length === 0 ? (
          <p style={layout.emptyState}>Automobilių dar nėra</p>
        ) : filteredCars.length === 0 ? (
          <p style={layout.emptyState}>
            Pagal „{search.trim()}“ automobilių nerasta
          </p>
        ) : (
          filteredCars.map((car) => (
            <CarCard
              key={car.id}
              id={car.id}
              carName={car.car_name}
              customerName={car.customers?.name}
              registrationNumber={car.registration_no}
              year={car.year}
              vin={car.vin}
              onClick={() => {}}
              onClickDelete={() => {}}
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
  toolbar: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: space.md,
    width: "100%",
  },
};
