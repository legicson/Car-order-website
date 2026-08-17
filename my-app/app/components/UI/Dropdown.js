"use client";

import { useRouter } from "next/navigation";
import Dropdown from "react-bootstrap/Dropdown";

export default function DropDown() {
  const router = useRouter();

  const handleSelect = (eventKey) => {
    // eventKey grąžins kelią, kurį nurodysime prie item
    if (eventKey) {
      router.push(eventKey);
    }
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

      <Dropdown.Menu>
        {/* Vietoj href rašome savo Next.js puslapių kelius į eventKey */}
        <Dropdown.Item eventKey="../">Pagrindinis puslapis</Dropdown.Item>
        <Dropdown.Item eventKey="/screens/customers">Klientai</Dropdown.Item>
        <Dropdown.Item eventKey="/screens/orders">Užsakymai</Dropdown.Item>
        <Dropdown.Item eventKey="/screens/cars">Automobiliai</Dropdown.Item>
        <Dropdown.Item eventKey="/screens/parts">Dalys</Dropdown.Item>
      </Dropdown.Menu>
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
