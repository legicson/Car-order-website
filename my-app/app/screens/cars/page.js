"use client";

import { supabase } from "./../../supabaseClient"; // Importuojame klientą
import { useState, useEffect } from "react";
import CustomButton from "../../components/UI/CustomButton";
import AddCustomerModal from "../../components/CustomerForm";
import ModalWrapper from "./../../components/ModalWrapper";

import Card from "./../../components/Card";
import CustomerForm from "./../../components/CustomerForm";
import CustomerDetailedForm from "./../../components/CustomerDetailedForm";
import CarForm from "./../../components/CarForm";

export default function cars({ children }) {
  const [modal, setModal] = useState(false);
  const [detailedModal, setDetailedModal] = useState(false);
  const [cars, setCars] = useState([]);
  const [carName, setCarName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [year, setYear] = useState("");
  const [userId, setUserId] = useState("");

  const [selectedCar, setSelectedCar] = useState(null);

  const addCar = async () => {
    if (!carName.trim()) return;

    const { error } = await supabase
      .from("cars")
      .insert([{ car_name: carName, registration_no: registrationNumber, year: year, user_id: userId }]);

    if (error) {
      console.error("Klaida pridedant automobilį:", error.message);
    } else {
      setCarName(""); // Išvalome laukelį
      setRegistrationNumber(""); // Išvalome telefono laukelį
      setYear("");
      setUserId("");
    }
  };

  const handleCarAdding = (e) => {
    e.preventDefault();
    console.log("Car added:", carName);
    addCar();
    setModal(false);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("cars").select("*");

    if (error) {
      console.error("Klaida gaunant automobilius:", error.message);
    } else {
      setCars(data);
    }
  };

  useEffect(() => {
    fetchUsers();
    console.log(cars);
  }, [modal]);



  const openDetailedView = (customer) => {
    setSelectedCar(customer);
    setDetailedModal(true);
  };

  const showCustomerList = () => {
    return (
      <>
        {cars.map((car) => (
          <div key={car.id}>
            <Card
              id={car.id}
              header={car.car_name}
              addionalDetails={car.registration_no}
              onClick={openDetailedView.bind(this, car)}
            />
          </div>
        ))}
      </>
    );
  };

  return (
    <div style={styles.root}>
      <h1>Automobiliai</h1>
      <CustomButton
        ButtonText="Pridėti Klientą"
        onClick={() => setModal(true)}
      />
      <div style={styles.pageContent}>{showCustomerList()}</div>

      {modal && (
        <ModalWrapper isOpen={modal} onClose={() => setModal(false)}>
          <CarForm
            handleCarAdding={handleCarAdding}
            setModal={setModal}
            carName={carName}
            setCarName={setCarName}
            registrationNumber={registrationNumber}
            setRegistrationNumber={setRegistrationNumber}
            year={year}
            setYear={setYear}
            userId={userId}
            setUserId={setUserId}
          />
        </ModalWrapper>
      )}
      {detailedModal && (
        <ModalWrapper
          isOpen={detailedModal}
          onClose={() => setDetailedModal(false)}
        >
          <CustomerDetailedForm
            setModal={setDetailedModal}
            selectedCustomer={selectedCar}
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
