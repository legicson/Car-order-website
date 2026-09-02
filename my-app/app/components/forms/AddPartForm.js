"use client";

import { useState } from "react";
import formStyles from "../UI/formStyles";

const NAME_MIN_LENGTH = 3;

export default function AddPartForm({
  partName,
  setPartName,
  partPrice,
  setPartPrice,
  partNumber,
  setPartNumber,
  replacementCode,
  setReplacementCode,
  profitPercentage,
  setProfitPercentage,
  handlePartAdding,
  setShowPartForm,
  resetValues,
  submitButtonText,
}) {
  const [errors, setErrors] = useState({});

  // Pavadinimas, Kaina and Pelno procentas are required; the codes are
  // optional.
  const validators = {
    partName: (value) => {
      const trimmed = String(value ?? "").trim();
      if (!trimmed) return "Įveskite dalies pavadinimą.";
      if (trimmed.length < NAME_MIN_LENGTH) {
        return `Pavadinimas turi būti bent ${NAME_MIN_LENGTH} simbolių.`;
      }
      return "";
    },
    // Both pages parse the price with a comma-to-dot swap, so accept either
    // separator here rather than rejecting "12,50".
    partPrice: (value) => {
      const trimmed = String(value ?? "").trim();
      if (!trimmed) return "Įveskite dalies kainą.";
      if (!/^\d+([.,]\d+)?$/.test(trimmed)) {
        return "Kaina turi būti teigiamas skaičius.";
      }
      return "";
    },
    // Same comma-or-dot rule as the price, but capped at two decimals.
    profitPercentage: (value) => {
      const trimmed = String(value ?? "").trim();
      if (!trimmed) return "Įveskite pelno procentą.";
      if (!/^\d+([.,]\d{1,2})?$/.test(trimmed)) {
        return "Pelno procentas turi būti skaičius su ne daugiau nei 2 skaičiais po kablelio.";
      }
      return "";
    },
  };

  // Only re-check a field while typing if it is already flagged, so nobody
  // gets an error mid-word.
  const handleChange = (field, setValue) => (e) => {
    const value = e.target.value;
    setValue(value);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: validators[field](value) }));
    }
  };

  const handleBlur = (field) => (e) => {
    setErrors((prev) => ({
      ...prev,
      [field]: validators[field](e.target.value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = {
      partName: validators.partName(partName),
      partPrice: validators.partPrice(partPrice),
      profitPercentage: validators.profitPercentage(profitPercentage),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    handlePartAdding(e);
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles.card} noValidate>
      <h2 style={formStyles.title}>Dalis</h2>

      <div style={formStyles.fields}>
        <div style={formStyles.field}>
          <label style={formStyles.label} htmlFor="part-name">
            Pavadinimas
          </label>
          <input
            id="part-name"
            className="app-input"
            style={errors.partName ? formStyles.inputError : undefined}
            type="text"
            value={partName}
            onChange={handleChange("partName", setPartName)}
            onBlur={handleBlur("partName")}
            placeholder="Motul 5W30"
            minLength={NAME_MIN_LENGTH}
            required
            aria-invalid={errors.partName ? true : undefined}
            aria-describedby={errors.partName ? "part-name-error" : undefined}
          />
          {errors.partName && (
            <span id="part-name-error" style={formStyles.error} role="alert">
              {errors.partName}
            </span>
          )}
        </div>

        <div style={formStyles.field}>
          <label style={formStyles.label} htmlFor="part-price">
            Kaina
          </label>
          <input
            id="part-price"
            className="app-input"
            style={errors.partPrice ? formStyles.inputError : undefined}
            type="text"
            inputMode="decimal"
            value={partPrice}
            onChange={handleChange("partPrice", setPartPrice)}
            onBlur={handleBlur("partPrice")}
            placeholder="0.00"
            required
            aria-invalid={errors.partPrice ? true : undefined}
            aria-describedby={errors.partPrice ? "part-price-error" : undefined}
          />
          <p>Kliento kaina: {(partPrice * (1 + profitPercentage / 100)).toFixed(2)}</p>
          {errors.partPrice && (
            <span id="part-price-error" style={formStyles.error} role="alert">
              {errors.partPrice}
            </span>
          )}
        </div>

        <div style={formStyles.field}>
          <label style={formStyles.label} htmlFor="part-number">
            Dalies kodas <span style={formStyles.labelHint}>(neprivaloma)</span>
          </label>
          <input
            id="part-number"
            className="app-input"
            type="text"
            value={partNumber}
            onChange={(e) => setPartNumber(e.target.value)}
            placeholder="132-123-123"
          />
        </div>
        <div style={formStyles.field}>
          <label style={formStyles.label} htmlFor="replacement-code">
            Pakeitimo kodas{" "}
            <span style={formStyles.labelHint}>(neprivaloma)</span>
          </label>
          <input
            id="replacement-code"
            className="app-input"
            type="text"
            value={replacementCode}
            onChange={(e) => setReplacementCode(e.target.value)}
            placeholder="ABC-123-XYZ"
          />
        </div>

        <div style={formStyles.field}>
          <label style={formStyles.label} htmlFor="profit-percentage">
            Pelno procentas
          </label>
          <input
            id="profit-percentage"
            className="app-input"
            style={errors.profitPercentage ? formStyles.inputError : undefined}
            type="text"
            inputMode="decimal"
            value={profitPercentage}
            onChange={handleChange("profitPercentage", setProfitPercentage)}
            onBlur={handleBlur("profitPercentage")}
            placeholder="10"
            required
            aria-invalid={errors.profitPercentage ? true : undefined}
            aria-describedby={
              errors.profitPercentage ? "profit-percentage-error" : undefined
            }
          />
          {errors.profitPercentage && (
            <span
              id="profit-percentage-error"
              style={formStyles.error}
              role="alert"
            >
              {errors.profitPercentage}
            </span>
          )}
        </div>
      </div>

      <div style={formStyles.buttonRow}>
        <button type="submit" className="app-btn app-btn-primary">
          {submitButtonText}
        </button>
        <button
          type="button"
          className="app-btn app-btn-secondary"
          onClick={() => {
            setErrors({});
            setShowPartForm(false);

            resetValues();
          }}
        >
          Atšaukti
        </button>
      </div>
    </form>
  );
}
