"use client";

import { supabase } from "./../../supabaseClient"; // Importuojame klientą
import { useState, useEffect } from "react";
import CustomButton from "../../components/UI/CustomButton";
import AddCustomerModal from "./../../components/AddCustomerModal";

export default function customers({ children }) {
  const [addCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
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
    console.log(customers);
  }, [addCustomerModalOpen]);

  const showCustomer = () => {
    return (
      <ul>
        {customers.map((customer) => (
          <li key={customer.id}>
            {customer.name} - {customer.phoneNo}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Klientai</h1>
      <CustomButton
        ButtonText="Pridėti Klientą"
        onClick={() => setAddCustomerModalOpen(true)}
      />
      {showCustomer()}

      {addCustomerModalOpen && (
        <AddCustomerModal setAddCustomerModalOpen={setAddCustomerModalOpen} />
      )}
    </div>
  );
}
