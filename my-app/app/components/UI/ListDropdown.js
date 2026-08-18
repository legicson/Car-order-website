"use client";

import { useRouter } from "next/navigation";
import Dropdown from "react-bootstrap/Dropdown";
import { supabase } from "../../supabaseClient"; // Importuojame klientą
import { useState, useEffect } from "react";

export default function ListDropdown() {
  const router = useRouter();

  const [customers, setCustomers] = useState([]);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("customers").select("*");

    if (error) {
      console.error("Klaida gaunant vartotojus:", error.message);
    } else {
      setCustomers(data.sort((a, b) => a.id - b.id));
    }
  };

  useEffect(() => {
    fetchUsers();
    console.log(customers);
  }, []);

  const handleSelect = (eventKey) => {};

  const returnList = () => {
    return (
      <Dropdown.Menu>
        {customers.map((customer) => (
          <Dropdown.Item eventKey="../">Pagrindinis puslapis</Dropdown.Item>
        ))}
      </Dropdown.Menu>
    );
  };

  return (
    <Dropdown style={style.dropdown} onSelect={handleSelect}>
      <Dropdown.Toggle
        style={style.mainButton}
        // variant="success"
        id="dropdown-basic"
      >
        Menu
      </Dropdown.Toggle>

      {returnList()}
    </Dropdown>
  );
}

const style = {
  dropdown: {
    position: "absolute",
    top: "5vh",
    right: "5vh",
    // backgroundColor: "#850c0c",
    // width: "100%",
    // marginLeft: "5vh",
    // marginTop: "2vh",
  },
  mainButton: {
    borderRadius: "20px",
    padding: "10px 30px",
    backgroundColor: "#134469ff",
    border: "none",
  },
};
