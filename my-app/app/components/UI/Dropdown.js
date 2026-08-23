"use client";

import { useRouter } from "next/navigation";
import Dropdown from "react-bootstrap/Dropdown";
import { colors, radius, shadow } from "../../theme";

export default function DropDown() {
  const PATH = {
    mainPage: "/",
    customers: "/screens/customers",
    orders: "/screens/orders",
    cars: "/screens/cars",
    parts: "/screens/parts",
  };

  const router = useRouter();

  const handleSelect = (eventKey) => {
    // eventKey grąžins kelią, kurį nurodysime prie item
    if (eventKey) {
      router.push(eventKey);
    }
  };

  return (
    <Dropdown onSelect={handleSelect} align="end">
      <Dropdown.Toggle style={style.mainButton} id="dropdown-basic">
        Meniu
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {/* Vietoj href rašome savo Next.js puslapių kelius į eventKey */}
        <Dropdown.Item eventKey={PATH.mainPage}>
          Pagrindinis puslapis
        </Dropdown.Item>
        <Dropdown.Item eventKey={PATH.customers}>Klientai</Dropdown.Item>
        <Dropdown.Item eventKey={PATH.orders}>Užsakymai</Dropdown.Item>
        <Dropdown.Item eventKey={PATH.cars}>Automobiliai</Dropdown.Item>
        <Dropdown.Item eventKey={PATH.parts}>Dalys</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

const style = {
  mainButton: {
    backgroundColor: colors.surface,
    border: `1px solid ${colors.borderStrong}`,
    borderRadius: radius.md,
    boxShadow: shadow.sm,
    color: colors.text,
    fontSize: "0.95rem",
    fontWeight: 600,
    padding: "9px 18px",
  },
};
