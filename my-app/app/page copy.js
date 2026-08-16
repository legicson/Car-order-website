"use client";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient"; // Importuojame klientą
import styles from "./page.module.css";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [nameInput, setNameInput] = useState("");

  // 1. QUERY: Gauname vartotojų sąrašą iš Supabase
  const fetchUsers = async () => {
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
      console.error("Klaida gaunant vartotojus:", error.message);
    } else {
      setUsers(data);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. QUERY: Pridedame naują vartotoją į Supabase
  const handleSubmit = async () => {
    if (!nameInput.trim()) return;

    const { error } = await supabase
      .from("users")
      .insert([{ name: nameInput }]);

    if (error) {
      console.error("Klaida pridedant vartotoją:", error.message);
    } else {
      setNameInput(""); // Išvalome laukelį
      fetchUsers(); // Atnaujiname sąrašą ekrane
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>Vartotojų sąrašas (Supabase)</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>

      <div style={{ marginTop: "20px" }}>
        <input
          id="userName"
          type="text"
          placeholder="Enter your name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button onClick={handleSubmit} style={{ padding: "8px 16px" }}>
          Submit
        </button>
      </div>
    </div>
  );
}
