"use client";
import AddPartModal from "@/app/components/AddPartModal";
import CustomButton from "@/app/components/UI/CustomButton";
import { useState, useEffect } from "react";

// import { supabase }  from "./../../supabaseClient"; // Importuojame klientą
import { supabase } from "../../supabaseClient";

export default function cars({ children }) {
  const [addPartModalOpen, setAddPartModalOpen] = useState(false);
  const [parts, setParts] = useState([]);

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
    console.log(parts)
  }, [addPartModalOpen]);

  const showParts = () => {
    return (
      <ul>
        {parts.map((part) => (
          <li key={part.id}>
            {part.partName} {part.price} {part.partNumber}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Parts Page</h1>
      <CustomButton
        ButtonText="Add Part"
        onClick={() => setAddPartModalOpen(true)}
      />

      {addPartModalOpen && (
        <AddPartModal setAddPartModalOpen={setAddPartModalOpen}  />
      )}
      {showParts()}
    </div>
  );
}
