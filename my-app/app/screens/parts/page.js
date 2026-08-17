"use client";
import AddPartModal from "@/app/components/AddPartModal";
import CustomButton from "@/app/components/UI/CustomButton";
import { useState, useEffect } from "react";

export default function cars({ children }) {
  const [addCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
  const [parts, setParts] = useState([]);
  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Parts Page</h1>
      <CustomButton
        ButtonText="Add Part"
        onClick={() => setAddCustomerModalOpen(true)}
      />
      {addCustomerModalOpen && (
        <AddPartModal setAddPartModalOpen={setAddCustomerModalOpen} />
      )}
    </div>
  );
}
