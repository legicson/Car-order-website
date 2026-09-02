"use client";

import { supabase } from "./../../supabaseClient"; // Importuojame klientą
import { useState, useEffect } from "react";
import CarCard from "./../../components/cards/CarCard";
import Dropdown from "../../components/UI/Dropdown";
import SearchInput from "../../components/UI/SearchInput";
import { layout, space, text } from "../../theme";
import CarAddForm from "../../components/forms/CarAddForm";
import CustomButton from "../../components/UI/CustomButton";
import Card from "../../components/cards/Card";

export default function cars({ children }) {
  const [selectedCar, setSelectedCar] = useState(null);
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [showCarForm, setShowCarForm] = useState(false);
  const [showEditCarForm, setShowEditCarForm] = useState(false);
  const [step, setStep] = useState(1);
  const [carName, setCarName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [year, setYear] = useState("");
  const [comment, setComment] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [vin, setVin] = useState("");

  const resetValues = () => {
    setCarName("");
    setRegistrationNumber("");
    setYear("");
    setComment("");
    setVin("");
    setSelectedCustomer(null);
    setStep(1);
    setShowCarForm(false);
    setShowEditCarForm(false);
  };

  const fetchCustomers = async () => {
    const { data, error } = await supabase.from("customers").select("*");

    if (error) {
      console.error("Klaida gaunant vartotojus:", error.message);
    } else {
      setCustomers(data);
    }
  };
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

  const returnSelectableCustomerList = () => {
    return (
      <div style={style.picker}>
        <h2 style={style.pickerTitle}>
          "Pasirinkite klientą, kuriam norite pridėti automobilį"
        </h2>
        <div style={style.pickerActions}>
          <button
            type="button"
            className="app-btn app-btn-secondary"
            onClick={() => {
              setShowCarForm(false);
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
  useEffect(() => {
    fetchCars();
    fetchCustomers();
  }, []);

  const query = search.trim().toLowerCase();
  const addCar = async (newCustomerId) => {
    if (!carName.trim()) return;

    const { error } = await supabase.from("cars").insert([
      {
        car_name: carName,
        registration_no: registrationNumber,
        year: year,
        comment: comment,
        user_id: newCustomerId,
      },
    ]);

    if (error) {
      console.error("Klaida pridedant automobilį:", error.message);
    }
  };
  const filteredCars = query
    ? cars.filter((car) =>
        [
          car.car_name,
          car.registration_no,
          car.vin,
          car.year,
          car.customers?.name,
        ].some((field) =>
          String(field ?? "")
            .toLowerCase()
            .includes(query),
        ),
      )
    : cars;

  const onClickSetSelectedCustomer = (item) => {
    setSelectedCustomer(item);
    nextStep();
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
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

  const selectCar = (car) => {
    setSelectedCar(car);
    setCarName(car.car_name);
    setRegistrationNumber(car.registration_no);
    setYear(car.year);
    setVin(car.vin ?? "");
    setComment(car.comment);
    setShowEditCarForm(true);
  };

  const handleCarEdit = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("cars")
      .update({
        car_name: carName,
        registration_no: registrationNumber,
        year: year,
        comment: comment,
        vin: vin,
      })
      .eq("id", selectedCar.id);

    if (error) {
      console.error("Klaida redaguojant automobilį:", error.message);
    } else {
      fetchCars();
      setShowEditCarForm(false);
      resetValues();
    }
  };

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
          <CustomButton
            ButtonText="Pridėti automobilį"
            onClick={() => setShowCarForm(true)}
          />
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Ieškoti pagal markę, numerį, VIN, metus ar klientą"
            label="Ieškoti automobilių"
          />
        </div>
      )}

      <div style={{ ...layout.content, ...style.content }}>
        {!showCarForm &&
          !showEditCarForm &&
          (cars.length === 0 ? (
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
                comment={car.comment}
                onClick={() => {
                  selectCar(car);
                }}
                onClickDelete={() => {}}
              />
            ))
          ))}

        {showEditCarForm && (
          <CarAddForm
            carName={carName}
            setCarName={setCarName}
            registrationNumber={registrationNumber ?? ""}
            setRegistrationNumber={setRegistrationNumber}
            year={year}
            setYear={setYear}
            vin={vin ?? ""}
            setVin={setVin}
            comment={comment ?? ""}
            setComment={setComment}
            handleAddingCarCustomer={handleCarEdit}
            prevStep={() => {
              resetValues();
              setShowEditCarForm(false);
            }}
            submitText={"Išsaugoti"}
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
                vin={vin}
                setVin={setVin}
                comment={comment}
                setComment={setComment}
                handleAddingCarCustomer={handleAddingCarCustomer}
                prevStep={prevStep}
                submitText={"Pridėti"}
              />
            )))}
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

const style = {
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
