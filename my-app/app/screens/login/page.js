"use client";

import { useState } from "react";
import * as theme from "../../theme";
import CustomButton from "../../components/UI/CustomButton";
import { signIn } from "../../services/auth";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // On success AuthGuard sees the new session and redirects to "/".
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const { error } = await signIn(email.trim(), password);

    if (error) {
      console.error("Klaida prisijungiant:", error.message);
      setErrorMessage("Neteisingas el. paštas arba slaptažodis");
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Prisijungimo langas</h1>

        <form style={styles.form} onSubmit={handleLogin}>
          <div style={styles.formDiv}>
            <label style={styles.label} htmlFor="email">
              El. paštas
            </label>
            <input
              id="email"
              style={styles.input}
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div style={styles.formDiv}>
            <label style={styles.label} htmlFor="password">
              Slaptažodis
            </label>
            <input
              id="password"
              style={styles.input}
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          {errorMessage && <p style={styles.error}>{errorMessage}</p>}
          <CustomButton
            ButtonText={loading ? "Jungiamasi..." : "Prisijungti"}
            variant="primary"
            type="submit"
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    height: "100vh",
    width: "100%",
    // backgroundColor: theme.colors.surface,
    paddingTop: "10vh",
  },
  formContainer: {
    ...theme.layout.panel,
    padding: "20px 75px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    gap: theme.space.md,
  },
  formDiv: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.space.md,
  },
  title: {
    ...theme.text.pageTitle,
    textAlign: "center",
    marginBottom: theme.space.xl,
  },
  label: {
    ...theme.text.label,
  },
  input: {
    borderRadius: theme.radius.md,
    textAlign: "center",
    border: `1px solid ${theme.colors.border}`,
    padding: theme.space.sm,
  },
  error: {
    color: theme.colors.danger,
    fontSize: "0.9rem",
    margin: 0,
  },
};
