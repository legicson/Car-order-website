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
    <Dropdown onSelect={handleSelect}>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Menu
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {/* Vietoj href rašome savo Next.js puslapių kelius į eventKey */}
        <Dropdown.Item eventKey="/">Home page</Dropdown.Item>
        <Dropdown.Item eventKey="/customers">Customers</Dropdown.Item>
        <Dropdown.Item eventKey="/orders">Orders</Dropdown.Item>
        <Dropdown.Item eventKey="/cars">Cars</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
