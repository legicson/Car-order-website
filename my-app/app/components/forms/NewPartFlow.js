import { useState } from "react";
import { supabase } from "@/app/supabaseClient";
import AddPartForm from "@/app/components/forms/AddPartForm";

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
  formWrapper: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
};
