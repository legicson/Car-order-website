import { useState } from "react";
import { supabase } from "@/app/supabaseClient";
import AddPartForm from "@/app/components/AddPartForm";
import { space, text } from "@/app/theme";

export default function NewPartFlow({
  showPartForm,
  setShowPartForm,
  fetchParts,
}) {
  const [partName, setPartName] = useState("");
  const [partPrice, setPartPrice] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [replacementCode, setReplacementCode] = useState("");
  const [profitPercentage, setProfitPercentage] = useState("");

  const resetValues = () => {
    setPartName("");
    setPartPrice("");
    setPartNumber("");
    setReplacementCode("");
    setProfitPercentage("");
  };

  const handlePartAdding = (e) => {
    e.preventDefault();
    addPart();
    resetValues();
  };

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
  return (
    <>
      {showPartForm && (
        <div style={styles.formWrapper}>
          <AddPartForm
            partName={partName}
            setPartName={setPartName}
            partPrice={partPrice}
            setPartPrice={setPartPrice}
            partNumber={partNumber ?? ""}
            setPartNumber={setPartNumber}
            replacementCode={replacementCode ?? ""}
            setReplacementCode={setReplacementCode}
            profitPercentage={profitPercentage}
            setProfitPercentage={setProfitPercentage}
            handlePartAdding={handlePartAdding}
            setShowPartForm={setShowPartForm}
            resetValues={resetValues}
            submitButtonText={"Išsaugoti"}
          />
        </div>
      )}
    </>
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
