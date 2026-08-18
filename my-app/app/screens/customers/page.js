"use client";

import { supabase } from "./../../supabaseClient"; // Importuojame klientą
import { useState, useEffect } from "react";
import CustomButton from "../../components/UI/CustomButton";
import AddCustomerModal from "../../components/CustomerForm";
import ModalWrapper from "./../../components/ModalWrapper";

import Card from "./../../components/Card";
import CustomerForm from "./../../components/CustomerForm";
import CarForm from "./../../components/CarForm";
import CustomerDetailedForm from "./../../components/CustomerDetailedForm";

export default function customers({ children }) {
  const [modal, setModal] = useState(false);
  const [formState, setFormState] = useState("customer");
  const [detailedModal, setDetailedModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [userId, setUserId] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [car, setCar] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [year, setYear] = useState("");
  const [vin, setVin] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    if (!modal && !detailedModal) {
      resetValues();
    }
  }, [modal, detailedModal]);

  const resetValues = () => {
    setCustomerName("");
    setCustomerPhone("");
    setUserId("");
    setCar("");
    setRegistrationNumber("");
    setYear("");
    setVin("");
    setFormState("customer");
  };
  const addCustomer = async () => {
    if (!customerName.trim()) return;

    const { error } = await supabase.from("customers").insert([
      {
        id: userId,
        name: customerName,
        phone_number: customerPhone,
      },
    ]);

    if (error) {
      console.error("Klaida pridedant vartotoją:", error.message);
    } else {
      setCustomerName(""); // Išvalome laukelį
      setCustomerPhone(""); // Išvalome telefono laukelį
    }
  };

  const addCar = async () => {
    console.log("Inserting for user ID:", userId);
    if (!car.trim()) return;

    const { error } = await supabase.from("cars").insert([
      {
        car_name: car,
        registration_no: registrationNumber,
        year: year,
        user_id: formState === "additionalCar" ? selectedCustomer.id : userId,
      },
    ]);

    if (error) {
      console.error("Klaida pridedant automobilį:", error.message);
    } else {
      setCar(""); // Išvalome laukelį
      setRegistrationNumber(""); // Išvalome telefono laukelį
      setVin("");
      setYear("");
      setUserId("");
    }
  };

  const handleCarAdding = (e) => {
    e.preventDefault();
    console.log("Car added:", carName);
    addCar();
    setModal(false);
    setFormState("customer");
  };

  const handleCustomerAdding = (e) => {
    e.preventDefault();
    console.log("Customer added:", customerName);
    addCustomer();
    // setModal(false);
    setFormState("car");
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("customers").select("*");

    if (error) {
      console.error("Klaida gaunant vartotojus:", error.message);
    } else {
      setCustomers(data.sort((a, b) => a.id - b.id));
    }
  };

  useEffect(() => {
    fetchUsers();
    console.log(customers);
    setUserId(customers.length + 1);
  }, [modal]);

  const openDetailedView = (customer) => {
    setSelectedCustomer(customer);
    setDetailedModal(true);
  };

  const showCustomerList = () => {
    return (
      <>
        {customers.map((customer) => (
          <div key={customer.id}>
            <Card
              id={customer.id}
              header={customer.name}
              addionalDetails={customer.phone_number}
              onClick={openDetailedView.bind(this, customer)}
            />
          </div>
        ))}
      </>
    );
  };

  const returnForm = () => {
    if (formState === "customer") {
      return (
        <CustomerForm
          handleCustomerAdding={handleCustomerAdding}
          setModal={setModal}
          customerName={customerName}
          setCustomerName={setCustomerName}
          customerPhone={customerPhone}
          setCustomerPhone={setCustomerPhone}
          car={car}
          setCar={setCar}
          registrationNumber={registrationNumber}
          setRegistrationNumber={setRegistrationNumber}
          year={year}
          setYear={setYear}
          vin={vin}
          setVin={setVin}
        />
      );
    } else if (formState === "car") {
      return (
        <CarForm
          year={year}
          setYear={setYear}
          userId={userId}
          setUserId={setUserId}
          handleCarAdding={handleCarAdding}
          setModal={setModal}
          carName={car}
          setCarName={setCar}
          registrationNumber={registrationNumber}
          setRegistrationNumber={setRegistrationNumber}
        />
      );
    } else if (formState === "additionalCar") {
      return (
        <CarForm
          year={year}
          setYear={setYear}
          userId={selectedCustomer.id}
          setUserId={setUserId}
          handleCarAdding={handleCarAdding}
          setModal={setModal}
          carName={car}
          setCarName={setCar}
          registrationNumber={registrationNumber}
          setRegistrationNumber={setRegistrationNumber}
        />
      );
    }
  };

  const addAdditionalCar = () => {
    setFormState("additionalCar");
    setDetailedModal(false);
    setModal(true);
  };

  return (
    <div style={styles.root}>
      <h1>Klientai</h1>
      <CustomButton
        ButtonText="Pridėti Klientą"
        onClick={() => setModal(true)}
      />
      <div style={styles.pageContent}>{showCustomerList()}</div>

      {modal && (
        <ModalWrapper isOpen={modal} onClose={() => setModal(false)}>
          {returnForm()}
        </ModalWrapper>
      )}
      {detailedModal && (
        <ModalWrapper
          isOpen={detailedModal}
          onClose={() => setDetailedModal(false)}
        >
          <CustomerDetailedForm
            setModal={setDetailedModal}
            selectedCustomer={selectedCustomer}
            addAdditionalCar={addAdditionalCar}
          />
        </ModalWrapper>
      )}
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
  pageContent: {
    // display:"flex",
    // flexDirection:"row",
    // flex:1,
    // margin: 50,
  },

  modalButtonsContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalButton: {
    borderRadius: "20px",
    width: "30%",
    height: "50px",
    margin: "10px",
  },
  modalInput: {
    width: "80%",
    height: "40px",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "25px",
  },
  formContent: {
    // margin: "7%",
    display: "flex",
    flexDirection: "column",
    // justifyContent: "center",
    // alignItems: "center",
    height: "100%",

    // backgroundColor: "red",
  },
  formInput: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // height: "100%",
    // width: "100%",
  },
};
