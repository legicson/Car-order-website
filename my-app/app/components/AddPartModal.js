"use client";

import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient"; // Importuojame klientą

function AddPartModal({ setAddPartModalOpen }) {
  const [partName, setPartName] = useState("");
  const [partPrice, setPartPrice] = useState("");
  const [partNumber, setPartNumber] = useState("");

  const addPart = async () => {
    if (!partName.trim()) return;

    const { error } = await supabase
      .from("parts")
      .insert([
        { partName: partName, price: partPrice, partNumber: partNumber },
      ]);

    if (error) {
      console.error("Klaida pridedant dalį:", error.message);
    } else {
      setPartName(""); // Išvalome laukelį
      setPartPrice(""); // Išvalome kainos laukelį
      setPartNumber(""); // Išvalome dalies numerio laukelį
    }
  };

  const handlePartAdding = (e) => {
    e.preventDefault();
    console.log("Part added:", partName);
    addPart();
    setAddPartModalOpen(false);
  };

  return (
    <div
      onClick={() => setAddPartModalOpen(false)}
      style={style.modalOverlay}
    >
      <div onClick={(e) => e.stopPropagation()} style={style.modalContent}>
        <form style={style.formContent} onSubmit={handlePartAdding}>
          <div style={style.formInput}>
            <label htmlFor="partName">Dalies pavadinimas:</label> <br />
            <input
              id="partName"
              placeholder="Dalis"
              value={partName}
              onChange={(e) => setPartName(e.target.value)}
              style={style.modalInput}
              minLength={3}
            />
          </div>
          <div style={style.formInput}>
            <label htmlFor="partPrice">Kaina:</label> <br />
            <input
              id="partPrice"
              type="number"
              placeholder="Kaina"
              value={partPrice}
              onChange={(e) => setPartPrice(e.target.value)}
              style={style.modalInput}
            />
          </div>
          <div style={style.formInput}>
            <label htmlFor="partNumber">Dalies numeris:</label> <br />
            <input
              id="partNumber"
              placeholder="Nr."
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
              style={style.modalInput}
            />
          </div>

          <div style={style.modalButtonsContainer}>
            <button type="submit" style={style.modalButton}>
              Pridėti dalį
            </button>
            <button
              type="button"
              style={style.modalButton}
              onClick={() => {
                setAddPartModalOpen(false);
              }}
            >
              Uždaryti
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPartModal;

const style = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    height: "30vh",
    width: "30vw",
    borderRadius: "20px",
    justifyContent: "space-around",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  },
  modalButtonsContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalButton: {
    backgroundColor: "#41bb7e",
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
    margin: "7%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  formInput: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
};
