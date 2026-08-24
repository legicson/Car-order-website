"use client";
import { supabase } from "./../../../supabaseClient"; // Importuojame klientą
import { use, useState, useEffect } from "react";
import CustomerCarInfo from "../../../components/CustomerCarInfo";
import PartsCard from "../../../components/PartsCard";
import { colors, layout, radius, shadow, space, text } from "../../../theme";

export default function orderList({ params }) {
  const [showPartAddingSection, setShowPartAddingSection] = useState(false);
  const [showAddedParts, setShowAddedParts] = useState(true);

  const { id } = use(params);
  const [car, setCar] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [parts, setParts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const [addedParts, setAddedParts] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
    fetchParts();
  }, []);

  useEffect(() => {
    fetchOrderItems();
  }, [showPartAddingSection]);

  useEffect(() => {
    calculateOrderTotalPrice();
  }, [orderItems]);

  const fetchParts = async () => {
    const { data, error } = await supabase.from("parts").select("*");

    if (error) {
      console.error("Klaida gaunant dalis:", error.message);
    } else {
      setParts(data);
    }
  };

  const fetchOrderItems = async () => {
    const { data, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", id);

    if (error) {
      console.error("Klaida gaunant dalis:", error.message);
    } else {
      setOrderItems(data);
    }
  };

  const calculateOrderTotalPrice = () => {
    const total = orderItems.reduce(
      (sum, item) => sum + item.quantity * item.price_at_sale,
      0,
    );

    setTotalPrice(total.toFixed(2));
    return total.toFixed(2);
  };

  const deleteOrderItem = async (orderItemId) => {
    const { error } = await supabase
      .from("order_items")
      .delete()
      .eq("id", orderItemId);

    if (error) {
      console.error("Klaida šalinant užsakymo elementą:", error.message);
      return;
    }

    setOrderItems(orderItems.filter((item) => item.id !== orderItemId));
  };

  const addOrderItems = async () => {
    setShowPartAddingSection(false);
    setShowAddedParts(true);
    addedParts.forEach(async (part) => {
      const { error } = await supabase.from("order_items").insert([
        {
          order_id: id,
          part_id: part.id,
          quantity: part.quantity,
          price_at_sale: part.price,
        },
      ]);

      if (error) {
        console.error("Klaida pridedant užsakymo elementą:", error.message);
      } else {
        setAddedParts([]);
        fetchOrderItems();
      }
    });
  };

  const fetchOrderDetails = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
    id,
    created_at,
    total_price,
    income,
    status,
    car:cars (
      id,
      car_name,
      registration_no,
      year,
      customer:customers (
        id,
        name,
        phone_number,
        creation_date
      )
    )
  `,
      )
      .eq("id", id)
      .single();

    if (error) {
      console.log(error);
    } else {
      setCar(data.car);
      setCustomer(data.car.customer);
    }
  };

  const returnAddedParts = () => {
    return addedParts.map((part) => (
      <PartsCard
        key={part.id}
        onClick={() => removeCard(part.id)}
        header={part.partName}
        details={
          <>
            <p>Kodas: {part.partNumber}</p>
            <p>Kiekis: {part.quantity}</p>
          </>
        }
        price={`${part.price} €`}
      />
    ));
  };

  const returnPartAddingSection = () => {
    return (
      <div style={styles.partAddingSection}>
        <div style={styles.column}>
          <h2 style={text.sectionTitle}>Galimos dalys</h2>
          <div style={layout.list}>{returnAvailableParts()}</div>
        </div>
        <div style={styles.column}>
          <h2 style={text.sectionTitle}>Pasirinktos dalys</h2>
          <div style={layout.list}>
            {addedParts.length === 0 ? (
              <p style={layout.emptyState}>Dar nieko nepasirinkta</p>
            ) : (
              returnAddedParts()
            )}
          </div>
        </div>
      </div>
    );
  };

  const selectCard = (id) => {
    const selectedPart = parts.find((part) => part.id === id);
    if (!selectedPart) return;

    const existingPart = addedParts.find((part) => part.id === id);
    if (existingPart) {
      setAddedParts(
        addedParts.map((part) =>
          part.id === id ? { ...part, quantity: part.quantity + 1 } : part,
        ),
      );
      return;
    } else {
      setAddedParts([...addedParts, { ...selectedPart, quantity: 1 }]);
    }
  };

  const removeCard = (id) => {
    const existingPart = addedParts.find((part) => part.id === id);
    if (!existingPart) return;

    if (existingPart.quantity > 1) {
      setAddedParts(
        addedParts.map((part) =>
          part.id === id ? { ...part, quantity: part.quantity - 1 } : part,
        ),
      );
    } else {
      setAddedParts(addedParts.filter((part) => part.id !== id));
    }
  };

  const returnAvailableParts = () => {
    return parts.map((part) => (
      <PartsCard
        key={part.id}
        header={part.partName}
        details={<p>Kodas: {part.partNumber}</p>}
        price={`${part.price} €`}
        onClick={() => selectCard(part.id)}
      />
    ));
  };

  const showOrderItems = () => {
    return orderItems.map((orderItem) => (
      <PartsCard
        key={orderItem.id}
        onDelete={() => deleteOrderItem(orderItem.id)}
        header={
          parts.find((part) => part.id === orderItem.part_id)?.partName ||
          "Nežinoma dalis"
        }
        details={
          <>
            <p>
              Kodas:{" "}
              {parts.find((part) => part.id === orderItem.part_id)
                ?.partNumber || "-"}
            </p>
            <p>Kiekis: {orderItem.quantity}</p>
          </>
        }
        price={`${orderItem.price_at_sale} €`}
      />
    ));
  };


  

  return (
    <div style={layout.page}>
      <div style={styles.dashboard}>
        <div style={styles.dashboardTop}>
          <h1 style={text.pageTitle}>Užsakymas #{id}</h1>
          <div style={styles.dashboardActions}>
            <button
              className="app-btn app-btn-secondary"
              onClick={() => {
                setShowPartAddingSection(!showPartAddingSection);
                setShowAddedParts(!showAddedParts);
              }}
            >
              Pridėti dalis
            </button>
            <button className="app-btn app-btn-primary" onClick={addOrderItems}>
              Išsaugoti
            </button>
          </div>
        </div>

        <CustomerCarInfo customer={customer} car={car} />

        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>Bendra suma</span>
          <span style={styles.totalValue}>{totalPrice} €</span>
        </div>
      </div>

      <div style={styles.content}>
        {showPartAddingSection && returnPartAddingSection()}
        {showAddedParts && (
          <div style={styles.column}>
            <h2 style={text.sectionTitle}>Užsakymo dalys</h2>
            <div style={layout.list}>
              {orderItems.length === 0 ? (
                <p style={layout.emptyState}>Dalių dar nepridėta</p>
              ) : (
                showOrderItems()
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  dashboard: {
    display: "flex",
    flexDirection: "column",
    gap: space.xl,
    padding: space.xl,
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.lg,
    boxShadow: shadow.sm,
  },
  dashboardTop: {
    display: "flex",
    flexWrap: "wrap",
    gap: space.md,
    alignItems: "center",
    justifyContent: "space-between",
  },
  dashboardActions: {
    display: "flex",
    flexWrap: "wrap",
    gap: space.sm,
  },
  totalRow: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: space.md,
    paddingTop: space.lg,
    borderTop: `1px solid ${colors.border}`,
  },
  totalLabel: {
    ...text.label,
  },
  totalValue: {
    fontSize: "1.5rem",
    fontWeight: 700,
    fontVariantNumeric: "tabular-nums",
    color: colors.text,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: space.xl,
    width: "100%",
  },
  partAddingSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: space.xl,
    width: "100%",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    minWidth: 0,
  },
};
