"use client";

import CustomButton from "@/app/components/UI/CustomButton";
import AddPartForm from "@/app/components/AddPartForm";
import { useState, useEffect } from "react";
import PartsCard from "@/app/components/PartsCard";
import Dropdown from "@/app/components/UI/Dropdown";
import { layout, space, text } from "@/app/theme";

import { supabase } from "../../supabaseClient";

export default function cars({ children }) {
  const [showPartForm, setShowPartForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [parts, setParts] = useState([]);
  const [search, setSearch] = useState("");

  const [partName, setPartName] = useState("");
  const [partPrice, setPartPrice] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [replacementCode, setReplacementCode] = useState("");
  const [profitPercentage, setProfitPercentage] = useState("");
  const [selectedPart, setSelectedPart] = useState(null);

  const addPart = async () => {
    const normalizedPrice = parseFloat(String(partPrice).replace(",", "."));
    const { error } = await supabase.from("parts").insert([
      {
        partName: partName,
        price: normalizedPrice,
        partNumber: partNumber,
        replacement_code: replacementCode,
        profit_percentage: profitPercentage,
      },
    ]);

    if (error) {
      console.error("Klaida pridedant dalį:", error.message);
    } else {
      setShowPartForm(false);
      resetValues();
      fetchParts(); // Atkuriame dalis po pridėjimo
    }
  };

  const editPart = async (partId) => {
    const normalizedPrice = parseFloat(String(partPrice).replace(",", "."));
    const { error } = await supabase
      .from("parts")
      .update({
        partName: partName,
        price: normalizedPrice,
        partNumber: partNumber,
        replacement_code: replacementCode,
        profit_percentage: profitPercentage,
      })
      .eq("id", partId);

    if (error) {
      console.error("Klaida redaguojant dalį:", error.message);
    } else {
      setShowEditForm(false);
      resetValues();
      fetchParts(); // Atkuriame dalis po redagavimo
    }
  };

  const deletePart = async (partId) => {
    const { error } = await supabase
      .from("parts")
      .update({ active: false })
      .eq("id", partId);

    if (error) {
      console.error("Klaida trinant dalį:", error.message);
    } else {
      fetchParts(); // Atkuriame dalis po trynimo
    }
  };

  const handlePartAdding = (e) => {
    e.preventDefault();
    addPart();
    resetValues();
  };

  const handlePartEdit = (e) => {
    e.preventDefault();
    editPart(selectedPart.id);
    resetValues();
  };

  const handlePartDelete = (partId) => {
    deletePart(partId);
  };

  const resetValues = () => {
    setPartName("");
    setPartPrice("");
    setPartNumber("");
    setReplacementCode("");
    setProfitPercentage("");
  };

  const fetchParts = async () => {
    const { data, error } = await supabase
      .from("parts")
      .select("*")
      .eq("active", true);

    if (error) {
      console.error("Klaida gaunant dalis:", error.message);
    } else {
      setParts(data.sort((a, b) => new Date(b.id) - new Date(a.id)));
    }
  };

  useEffect(() => {
    fetchParts();
  }, [showPartForm]);

  const query = search.trim().toLowerCase();

  const filteredParts = query
    ? parts.filter((part) => {
        const name = String(part.partName ?? "").toLowerCase();
        const number = String(part.partNumber ?? "").toLowerCase();
        return name.includes(query) || number.includes(query);
      })
    : parts;

  const showParts = () => {
    return filteredParts.map((part) => (
      <PartsCard
        key={part.id}
        header={part.partName}
        details={part.partNumber}
        price={part.price}
        onDelete={() => handlePartDelete(part.id)}
        onClick={() => onPartCardClick(part)}
      />
    ));
  };

  // The numeric columns come back as numbers, but the form fields are text
  // inputs, so everything has to land in state as a string.
  const toFieldValue = (value) => (value == null ? "" : String(value));

  const onPartCardClick = (part) => {
    setPartName(toFieldValue(part.partName));
    setPartPrice(toFieldValue(part.price));
    setPartNumber(toFieldValue(part.partNumber));
    setReplacementCode(toFieldValue(part.replacement_code));
    setProfitPercentage(toFieldValue(part.profit_percentage));
    setSelectedPart(part);
    setShowEditForm(true);
  };

  return (
    <div style={layout.page}>
      <div style={layout.header}>
        <div>
          <h1 style={text.pageTitle}>Dalys</h1>
          <p style={styles.subtitle}>
            {query
              ? `Rasta ${filteredParts.length} iš ${parts.length}`
              : `${parts.length} ${parts.length === 1 ? "dalis" : "dalys"} sandėlyje`}
          </p>
        </div>
        <Dropdown />
      </div>

      {!showPartForm && !showEditForm && (
        <>
          <div style={styles.toolbar}>
            <CustomButton
              ButtonText="Pridėti dalį"
              onClick={() => setShowPartForm(true)}
            />

            {parts.length > 0 && (
              <div style={styles.searchWrapper}>
                <input
                  className="app-input"
                  style={styles.searchInput}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Ieškoti pagal pavadinimą arba kodą"
                  aria-label="Ieškoti dalių"
                />
                {search && (
                  <button
                    type="button"
                    className="app-icon-btn"
                    style={styles.clearButton}
                    onClick={() => setSearch("")}
                    aria-label="Išvalyti paiešką"
                  >
                    &times;
                  </button>
                )}
              </div>
            )}
          </div>

          <div style={layout.list}>
            {parts.length === 0 ? (
              <p style={layout.emptyState}>Dalių dar nėra</p>
            ) : filteredParts.length === 0 ? (
              <p style={layout.emptyState}>
                Pagal „{search.trim()}“ dalių nerasta
              </p>
            ) : (
              showParts()
            )}
          </div>
        </>
      )}

      {showPartForm && (
        <div style={styles.formWrapper}>
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
            replacementCode={replacementCode}
            setReplacementCode={setReplacementCode}
            profitPercentage={profitPercentage}
            setProfitPercentage={setProfitPercentage}
            submitButtonText={"Sukurti"}
          />
        </div>
      )}

      {showEditForm && (
        <div style={styles.formWrapper}>
          <AddPartForm
            partName={partName}
            setPartName={setPartName}
            partPrice={partPrice}
            setPartPrice={setPartPrice}
            partNumber={partNumber}
            setPartNumber={setPartNumber}
            replacementCode={replacementCode}
            setReplacementCode={setReplacementCode}
            profitPercentage={profitPercentage}
            setProfitPercentage={setProfitPercentage}
            handlePartAdding={handlePartEdit}
            setShowPartForm={setShowEditForm}
            resetValues={resetValues}
            submitButtonText={"Išsaugoti"}
          />
        </div>
      )}
    </div>
  );
}

const styles = {
  subtitle: {
    ...text.muted,
    margin: "4px 0 0",
  },
  formWrapper: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  toolbar: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: space.md,
    width: "100%",
  },
  searchWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    flex: "1 1 260px",
    maxWidth: "420px",
  },
  searchInput: {
    paddingRight: "40px",
  },
  clearButton: {
    position: "absolute",
    right: "4px",
  },
};
