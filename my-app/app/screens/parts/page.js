"use client";
import AddPartModal from "@/app/components/AddPartModal";
import CustomButton from "@/app/components/UI/CustomButton";
import AddPartForm from "@/app/components/AddPartForm";
import { useState, useEffect } from "react";
import PartsCard from "@/app/components/PartsCard";
import Dropdown from "@/app/components/UI/Dropdown";

// import { supabase }  from "./../../supabaseClient"; // Importuojame klientą
import { supabase } from "../../supabaseClient";

export default function cars({ children }) {
  const [showPartForm, setShowPartForm] = useState(false);
  const [parts, setParts] = useState([]);

  const [partName, setPartName] = useState("");
  const [partPrice, setPartPrice] = useState("");
  const [partNumber, setPartNumber] = useState("");

  const addPart = async () => {
    const normalizedPrice = parseFloat(String(partPrice).replace(",", "."));
    const { data, error } = await supabase.from("parts").insert([
      {
        partName: partName,
        price: normalizedPrice,
        partNumber: partNumber,
      },
    ]);

    if (error) {
      console.error("Klaida pridedant dalį:", error.message);
    } else {
      console.log("Dalys sėkmingai pridėta:", data);
      setShowPartForm(false);
      resetValues();
      fetchParts(); // Atkuriame dalis po pridėjimo
    }
  };

  const handlePartAdding = (e) => {
    e.preventDefault();
    addPart();
    resetValues();
  };

  const resetValues = () => {
    setPartName("");
    setPartPrice("");
    setPartNumber("");
  };
  const fetchParts = async () => {
    const { data, error } = await supabase.from("parts").select("*");

    if (error) {
      console.error("Klaida gaunant dalis:", error.message);
    } else {
      setParts(data);
    }
  };

  useEffect(() => {
    fetchParts();
    console.log(parts);
  }, [showPartForm]);

  const showParts = () => {
    return parts.map((part) => (
      <PartsCard
        key={part.id}
        header={part.partName}
        details={part.partNumber}
        price={part.price}
      />
    ));
  };

  return (
    <div style={styles.root}>
      <h1>Parts Page</h1>

      <div style={styles.content}>
        {!showPartForm && (
          <>
            <Dropdown />
            <CustomButton
              ButtonText="Add Part"
              onClick={() => setShowPartForm(true)}
            />
          </>
        )}

        {showPartForm && (
          <AddPartForm
            partName={partName}
            setPartName={setPartName}
            partPrice={partPrice}
            setPartPrice={setPartPrice}
            partNumber={partNumber}
            setPartNumber={setPartNumber}
            handlePartAdding={handlePartAdding}
            setShowPartForm={setShowPartForm}
            resetValues={resetValues}
          />
        )}
        {!showPartForm && showParts()}
      </div>
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

  content: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    // backgroundColor: "green",
    justifyContent: "flex-start",
    alignItems: "center",
  },
};
