"use client";

import { useState } from "react";
import formStyles from "../UI/formStyles";

const EARLIEST_YEAR = 1900;
const COMMENT_MAX_LENGTH = 250;

export default function CarAddForm({
  carName,
  setCarName,
  registrationNumber,
  setRegistrationNumber,
  year,
  setYear,
  handleAddingCarCustomer,
  prevStep,
  comment,
  setComment,
  submitText,
  vin,
  setVin,
}) {
  const [errors, setErrors] = useState({});

  // Markė and Metai are required; the registration number is optional.
  const validators = {
    carName: (value) => (value.trim() ? "" : "Įveskite automobilio markę."),
    year: (value) => {
      const trimmed = value.trim();
      if (!trimmed) return "Įveskite automobilio metus.";
      if (!/^\d{4}$/.test(trimmed)) return "Metai turi būti keturi skaitmenys.";

      const latestYear = new Date().getFullYear() + 1;
      if (Number(trimmed) < EARLIEST_YEAR || Number(trimmed) > latestYear) {
        return `Metai turi būti tarp ${EARLIEST_YEAR} ir ${latestYear}.`;
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
      carName: validators.carName(carName),
      year: validators.year(year),
    };
    setErrors(nextErrors);
    if (nextErrors.carName || nextErrors.year) return;

    handleAddingCarCustomer(e);
  };

  return (
    <form onSubmit={handleSubmit} style={formStyles.card} noValidate>
      <h2 style={formStyles.title}>Naujas automobilis</h2>

      <div style={formStyles.fields}>
        <div style={formStyles.field}>
          <label style={formStyles.label} htmlFor="car-name">
            Markė
          </label>
          <input
            id="car-name"
            className="app-input"
            style={errors.carName ? formStyles.inputError : undefined}
            type="text"
            value={carName}
            onChange={handleChange("carName", setCarName)}
            onBlur={handleBlur("carName")}
            placeholder="Mercedes"
            required
            aria-invalid={errors.carName ? true : undefined}
            aria-describedby={errors.carName ? "car-name-error" : undefined}
          />
          {errors.carName && (
            <span id="car-name-error" style={formStyles.error} role="alert">
              {errors.carName}
            </span>
          )}
        </div>
        <div style={formStyles.field}>
          <label style={formStyles.label} htmlFor="car-year">
            Metai
          </label>
          <input
            id="car-year"
            className="app-input"
            style={errors.year ? formStyles.inputError : undefined}
            type="text"
            inputMode="numeric"
            value={year}
            onChange={handleChange("year", setYear)}
            onBlur={handleBlur("year")}
            placeholder="2020"
            required
            aria-invalid={errors.year ? true : undefined}
            aria-describedby={errors.year ? "car-year-error" : undefined}
          />
          {errors.year && (
            <span id="car-year-error" style={formStyles.error} role="alert">
              {errors.year}
            </span>
          )}
        </div>
        <div style={formStyles.field}>
          <label style={formStyles.label} htmlFor="car-registration">
            Registracijos numeris{" "}
            <span style={formStyles.labelHint}>(neprivaloma)</span>
          </label>
          <input
            id="car-registration"
            className="app-input"
            type="text"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            placeholder="ABC123"
          />
        </div>
        <div style={formStyles.field}>
          <label style={formStyles.label} htmlFor="car-vin">
            VIN kodas <span style={formStyles.labelHint}>(neprivaloma)</span>
          </label>
          <input
            id="car-vin"
            className="app-input"
            type="text"
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            placeholder="1HGCM82633A123456"
          />
        </div>

        <div style={formStyles.field}>
          <label style={formStyles.label} htmlFor="car-comment">
            Komentaras <span style={formStyles.labelHint}>(neprivaloma)</span>
          </label>
          <textarea
            id="car-comment"
            className="app-input"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Papildoma informacija"
            maxLength={COMMENT_MAX_LENGTH}
            rows={4}
          />
          <span style={formStyles.labelHint}>
            {comment.length}/{COMMENT_MAX_LENGTH}
          </span>
        </div>
      </div>

      <div style={formStyles.buttonRow}>
        <button type="submit" className="app-btn app-btn-primary">
          {submitText}
        </button>
        <button
          type="button"
          className="app-btn app-btn-secondary"
          onClick={() => {
            setErrors({});
            prevStep();
          }}
        >
          Grįžti
        </button>
      </div>
    </form>
  );
}
