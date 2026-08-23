import { space } from "../../theme";

// Text filter box with a clear button. `onChange` receives the raw string,
// so callers can pass their setState function straight in.
function SearchInput({ value, onChange, placeholder, label }) {
  return (
    <div style={styles.wrapper}>
      <input
        className="app-input"
        style={styles.input}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
      />
      {value && (
        <button
          type="button"
          className="app-icon-btn"
          style={styles.clearButton}
          onClick={() => onChange("")}
          aria-label="Išvalyti paiešką"
        >
          &times;
        </button>
      )}
    </div>
  );
}

export default SearchInput;

const styles = {
  wrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    flex: "1 1 260px",
    maxWidth: "420px",
  },
  input: {
    paddingRight: "40px",
  },
  clearButton: {
    position: "absolute",
    right: space.xs,
  },
};
