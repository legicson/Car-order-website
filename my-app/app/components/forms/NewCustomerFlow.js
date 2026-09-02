import { useState } from "react";
import { supabase } from "@/app/supabaseClient";
import AddCustomerForm from "@/app/components/forms/AddCustomerForm";
import CarAddForm from "@/app/components/forms/CarAddForm";

export default function NewCustomerFlow({
  showCustomerForm,
  setShowCustomerForm,
  fetchCustomers,
  fetchCars,
}) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [step, setStep] = useState(1);

  const [carName, setCarName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [year, setYear] = useState("");
  const [comment, setComment] = useState("");
  const [vin, setVin] = useState("");

  const resetValues = () => {
    setShowCustomerForm(false);
    setCustomerName("");
    setCustomerPhone("");
    setStep(1);
    setCarName("");
    setRegistrationNumber("");
    setYear("");
    setComment("");
    setVin("");
  };
  const handleContinueClick = (e) => {
    e.preventDefault();
    nextStep();
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleAddingCarCustomer = async (e) => {
    e.preventDefault();
    let newCustomerId = await addCustomer();

    if (newCustomerId) {
      await addCar(newCustomerId);
      fetchCustomers();
      fetchCars();
      resetValues();
    } else {
      console.log("Nepavyko prideti kliento");
    }
  };

  const addCustomer = async () => {
    if (!customerName.trim()) return;

    const { data, error } = await supabase
      .from("customers")
      .insert([
        {
          name: customerName,
          phone_number: customerPhone,
        },
      ])
      .select();

    if (error) {
      console.error("Klaida pridedant vartotoją:", error.message);
    } else {
      return data[0].id;
    }
  };

  const addCar = async (newCustomerId) => {
    if (!carName.trim()) return;

    const { error } = await supabase.from("cars").insert([
      {
        car_name: carName,
        registration_no: registrationNumber,
        year: year,
        user_id: newCustomerId,
      },
    ]);

    if (error) {
      console.error("Klaida pridedant automobilį:", error.message);
    }
  };
  return (
    <>
      {showCustomerForm &&
        ((step === 1 && (
          <AddCustomerForm
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            handleContinueClick={handleContinueClick}
            setShowCustomerForm={setShowCustomerForm}
            resetValues={resetValues}
            submitText={"Toliau"}
          />
        )) ||
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
    </>
  );
}
