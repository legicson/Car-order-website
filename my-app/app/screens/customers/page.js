"use client";

import { supabase } from "./../../supabaseClient"; // Importuojame klientą
import { useState, useEffect } from "react";
import CustomButton from "../../components/UI/CustomButton";
import SearchInput from "../../components/UI/SearchInput";

import { layout, text } from "../../theme";
import CustomerCard from "../../components/cards/CustomerCard";

import AddCustomerForm from "../../components/forms/AddCustomerForm";
import NewCustomerFlow from "../../components/forms/NewCustomerFlow";

export default function Customers({ children }) {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showEditCustomerForm, setShowEditCustomerForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const resetValues = () => {
    setCustomerName("");
    setCustomerPhone("");
    setShowCustomerForm(false);
    setShowEditCustomerForm(false);
    setSelectedCustomer(null);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);
  async function fetchCustomers() {
    const { data: customers, error } = await supabase.from("customers").select(`
      *,
      cars (*)
    `);

    if (error) {
      console.error("Error fetching customers:", error);
      return;
    }

    setCustomers(customers);
  }


  const query = search.trim().toLowerCase();
  const filteredCustomers = query
    ? customers.filter((customer) => {
      const name = String(customer.name ?? "").toLowerCase();
      const phone = String(customer.phone_number ?? "").toLowerCase();

      return name.includes(query) || phone.includes(query);
    })
    : customers;

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone_number ?? "");
    setShowEditCustomerForm(true);
  };

  const handleEditCustomer = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("customers")
      .update({
        name: customerName,
        phone_number: customerPhone,
      })
      .eq("id", selectedCustomer.id);

    if (error) {
      console.error("Klaida redaguojant klientą:", error.message);
    } else {
      fetchCustomers();
      setShowEditCustomerForm(false);
      resetValues();
    }
  };

  const isFormOpen = showCustomerForm || showEditCustomerForm;

  return (
    <div className="app-page" style={layout.page}>
      {!isFormOpen && (
        <>
          <div style={layout.header}>
            <div>
              <h1 style={text.pageTitle}>Klientai</h1>
              <p style={layout.subtitle}>
                {query
                  ? `Rasta ${filteredCustomers.length} iš ${customers.length}`
                  : `${customers.length} ${customers.length === 1 ? "klientas" : "klientai"}`}
              </p>
            </div>
            <CustomButton
              ButtonText="+ Pridėti klientą"
              onClick={() => setShowCustomerForm(true)}
            />
          </div>

          {customers.length > 0 && (
            <div style={layout.toolbar}>
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Ieškoti pagal vardą arba telefono numerį"
                label="Ieškoti klientų"
              />
            </div>
          )}
        </>
      )}

      <div style={{ ...layout.content, ...styles.content }}>
        {showCustomerForm && (
          <NewCustomerFlow
            showCustomerForm={showCustomerForm}
            setShowCustomerForm={setShowCustomerForm}
            fetchCustomers={fetchCustomers}
            fetchCars={() => { }}
          />
        )}

        {showEditCustomerForm && (
          <AddCustomerForm
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            handleContinueClick={handleEditCustomer}
            setShowCustomerForm={setShowCustomerForm}
            resetValues={resetValues}
            submitText={"Išsaugoti"}
          />
        )}
        {!isFormOpen && customers.length === 0 && (
          <p style={{ ...layout.emptyState, width: "100%" }}>Klientų dar nėra</p>
        )}
        {!isFormOpen && customers.length > 0 && filteredCustomers.length === 0 && (
          <p style={{ ...layout.emptyState, width: "100%" }}>
            Pagal „{search.trim()}“ klientų nerasta
          </p>
        )}
        {!isFormOpen &&
          filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customerName={customer.name}
              phoneNumber={customer.phone_number}
              cars={customer.cars}
              onClick={() => {
                handleCustomerClick(customer);
              }}
              onClickDelete={() => { }}
            />
          ))}
      </div>
    </div>
  );
}

const styles = {
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
};
