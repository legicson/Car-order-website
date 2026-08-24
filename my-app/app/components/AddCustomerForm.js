"use client";

import { useState } from "react";
import formStyles from "./UI/formStyles";

const NAME_MIN_LENGTH = 3;

export default function AddCustomerForm({
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  handleContinueClick,
  setShowCustomerForm,
  resetValues,
}) {
  const [nameError, setNameError] = useState("");

  // Vardas is the only required field - the phone number is optional.
  const validateName = (value) => {
    const trimmed = value.trim();

    if (!trimmed) return "Įveskite kliento vardą.";
    if (trimmed.length < NAME_MIN_LENGTH) {
      return `Vardas turi būti bent ${NAME_MIN_LENGTH} simbolių.`;
    }
    return "";
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setCustomerName(value);
    // Only clear a shown error while typing; don't flag a field mid-word.
    if (nameError) setNameError(validateName(value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const error = validateName(customerName);
    setNameError(error);
    if (error) return;

    handleContinueClick(e);
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles.card} noValidate>
      <h2 style={formStyles.title}>Naujas klientas</h2>

      <div style={formStyles.fields}>
        <div style={formStyles.field}>
          <label style={formStyles.label} htmlFor="customer-name">
            Vardas pavardė
          </label>
          <input
            id="customer-name"
            className="app-input"
            style={nameError ? formStyles.inputError : undefined}
            type="text"
            value={customerName}
            onChange={handleNameChange}
            onBlur={(e) => setNameError(validateName(e.target.value))}
            placeholder="Jonas Jonaitis"
            minLength={NAME_MIN_LENGTH}
            required
            aria-invalid={nameError ? true : undefined}
            aria-describedby={nameError ? "customer-name-error" : undefined}
          />
          {nameError && (
            <span id="customer-name-error" style={formStyles.error} role="alert">
              {nameError}
            </span>
          )}
        </div>

        <div style={formStyles.field}>
          <label style={formStyles.label} htmlFor="customer-phone">
            Telefono numeris{" "}
            <span style={formStyles.labelHint}>(neprivaloma)</span>
          </label>
          <input
            id="customer-phone"
            className="app-input"
            type="text"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="+37061234567"
          />
        </div>
      </div>

      <div style={formStyles.buttonRow}>
        <button type="submit" className="app-btn app-btn-primary">
          Tęsti
        </button>
        <button
          type="button"
          className="app-btn app-btn-secondary"
          onClick={() => {
            setNameError("");
            setShowCustomerForm(false);
            resetValues();
          }}
        >
          Grįžti
        </button>
      </div>
    </form>
  );
}
