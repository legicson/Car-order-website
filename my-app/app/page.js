"use client";

import Dropdown from "./components/UI/Dropdown";
import { useState, useEffect } from "react";
import { button, Modal, Form } from "react-bootstrap";
import AddCustomerModal from "./components/AddCustomerModal";
import AddButtonsRow from "./components/UI/AddButtonsRow";
import { supabase } from "./supabaseClient"; // Importuojame klientą

export default function Home() {
  const [customers, setCustomers] = useState([]);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("customers").select("*");

    if (error) {
      console.error("Klaida gaunant vartotojus:", error.message);
    } else {
      setCustomers(data);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [customers]);

  const [addCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
  const [addOrderModalOpen, setAddOrderModalOpen] = useState(false);
  const [addCarModalOpen, setAddCarModalOpen] = useState(false);
  const [addPartModalOpen, setAddPartModalOpen] = useState(false);

  return (
    <div style={style.root}>
      <h2>Pagrindinis puslapis</h2>

      <AddButtonsRow
        setAddCustomerModalOpen={setAddCustomerModalOpen}
        setAddOrderModalOpen={setAddOrderModalOpen}
        setAddCarModalOpen={setAddCarModalOpen}
        setAddPartModalOpen={setAddPartModalOpen}
      />

      {addCustomerModalOpen && (
        <AddCustomerModal setAddCustomerModalOpen={setAddCustomerModalOpen} />
      )}
      <button onClick={() => console.log(customers)} style={style.addButton}>
        Test
      </button>
    </div>
  );
}

const style = {
  addButton: {
    borderRadius: "20px",
    margin: "10px",
    width: "200px",
    height: "50px",
    backgroundColor: "#41bb7e",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
};
