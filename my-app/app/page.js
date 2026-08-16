"use client";

import Dropdown from "./components/UI/Dropdown";
import { useState } from "react";
import { button, Modal, Form } from "react-bootstrap";
import AddCustomerModal from "./components/AddCustomerModal";
import AddButtonsRow from "./components/UI/AddButtonsRow";

export default function Home() {
  const [customerName, setCustomerName] = useState("");

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
        <AddCustomerModal
          customerName={customerName}
          setCustomerName={setCustomerName}
          setAddCustomerModalOpen={setAddCustomerModalOpen}
        />
      )}
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
