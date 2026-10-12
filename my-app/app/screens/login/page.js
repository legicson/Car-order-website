"use client";

import { useState } from "react";
import * as theme from "../../theme";
import CustomButton from "../../components/UI/CustomButton";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={styles.root}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Prisijungimo langas</h1>

        <form style={styles.form}>
          <div style={styles.formDiv}>
            <label style={styles.label}>Vardas</label>
            <input
              style={styles.input}
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div style={styles.formDiv}>
            <label style={styles.label}>Slaptažodis</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <CustomButton
            ButtonText="Prisijungti"
            variant="primary"
            onClick={() => {}}
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
};
