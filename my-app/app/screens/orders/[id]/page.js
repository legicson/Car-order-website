"use client";
import { supabase } from "./../../../supabaseClient"; // Importuojame klientą
import { use, useState, useEffect } from "react";
import CustomerCarInfo from "../../../components/CustomerCarInfo";
import PartsCard from "../../../components/PartsCard";
import { colors, layout, radius, shadow, space, text } from "../../../theme";
import Dropdown from "../../../components/UI/Dropdown";
import { useRouter } from "next/navigation";
import StatusDropdown from "../../../components/StatusDropdown";

// price/profit_percentage arrive from Supabase as float columns, so they are
// already numbers; the guards are for rows saved before the columns existed.
const toAmount = (value) => Number(value) || 0;

const formatPrice = (value) => `${toAmount(value).toFixed(2)} €`;

// Retail = the part's own price plus its profit margin, rounded to cents.
const calculateRetailPrice = (price, profitPercentage) =>
  Math.round(toAmount(price) * (1 + toAmount(profitPercentage) / 100) * 100) /
  100;

// Rows written before retail_price existed fall back to the bare price.
const orderItemRetailPrice = (orderItem) =>
  toAmount(orderItem.retail_price ?? orderItem.price_at_sale);

export default function orderList({ params }) {
  const router = useRouter();
  const [showPartAddingSection, setShowPartAddingSection] = useState(false);
  const [showAddedParts, setShowAddedParts] = useState(true);
  const [showOrderDetailsSection, setShowOrderDetailsSection] = useState(false);

  const { id } = use(params);

  const [car, setCar] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [parts, setParts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalRetailPrice, setTotalRetailPrice] = useState(0);
  const [mileage, setMileage] = useState("");
  const [labor, setLabor] = useState("");
  const [status, setStatus] = useState(null);

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
    calculateOrderTotals();
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

  const calculateOrderTotals = () => {
    const cost = orderItems.reduce(
      (sum, item) => sum + item.quantity * toAmount(item.price_at_sale),
      0,
    );
    const retail = orderItems.reduce(
      (sum, item) => sum + item.quantity * orderItemRetailPrice(item),
      0,
    );

    setTotalPrice(cost);
    setTotalRetailPrice(retail);
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
          price_at_sale: toAmount(part.price),
          retail_price: calculateRetailPrice(
            part.price,
            part.profit_percentage,
          ),
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
    status,
    mileage,
    labor,
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
      console.log(data.mileage);
      console.log(data.labor);
      setMileage(data.mileage);
      setLabor(data.labor);
      setStatus(data.status);
    }
  };

  const saveOrderDetails = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("orders")
      .update({
        mileage: mileage === "" ? null : Number(mileage),
        labor: labor === "" ? null : Number(labor),
      })
      .eq("id", id);

    if (error) {
      console.error("Klaida išsaugant užsakymo duomenis:", error.message);
      return;
    }

    setShowOrderDetailsSection(false);
  };

  const saveStatus = async (newStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Klaida išsaugant statusą:", error.message);
      return;
    }

    setStatus(newStatus);
  };

  const returnOrderDetailsSection = () => {
    return (
      <form style={styles.detailsForm} onSubmit={saveOrderDetails}>
        <div style={styles.detailsField}>
          <label style={text.label} htmlFor="order-mileage">
            Rida (km)
          </label>
          <input
            id="order-mileage"
            className="app-input"
            type="number"
            min="0"
            inputMode="numeric"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            placeholder="206000"
          />
        </div>
        <div style={styles.detailsField}>
          <label style={text.label} htmlFor="order-labor">
            Darbai (€)
          </label>
          <input
            id="order-labor"
            className="app-input"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={labor}
            onChange={(e) => setLabor(e.target.value)}
            placeholder="80.00"
          />
        </div>
        <div style={styles.dashboardActions}>
          <button type="submit" className="app-btn app-btn-primary">
            Išsaugoti
          </button>
          <button
            type="button"
            className="app-btn app-btn-secondary"
            onClick={() => setShowOrderDetailsSection(false)}
          >
            Atšaukti
          </button>
        </div>
      </form>
    );
  };

  // Retail is what the customer pays, so it leads; the bare part price sits
  // underneath it as the cost line.
  const returnPriceStack = (retail, cost) => (
    <span style={styles.priceStack}>
      <span>{formatPrice(retail)}</span>
      <span style={styles.priceCost}>Savikaina: {formatPrice(cost)}</span>
    </span>
  );

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
        price={returnPriceStack(
          calculateRetailPrice(part.price, part.profit_percentage),
          part.price,
        )}
      />
    ));
  };

  const returnPartAddingSection = () => {
    return (
      <div style={styles.partAddingSection}>
        <div style={styles.column}>
          <h2 style={text.sectionTitle}>Galimos dalys</h2>
          <div style={layout.content}>{returnAvailableParts()}</div>
        </div>
        <div style={styles.column}>
          <h2 style={text.sectionTitle}>Pasirinktos dalys</h2>
          <div style={layout.content}>
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
        price={returnPriceStack(
          calculateRetailPrice(part.price, part.profit_percentage),
          part.price,
        )}
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
        price={returnPriceStack(
          orderItemRetailPrice(orderItem),
          orderItem.price_at_sale,
        )}
      />
    ));
  };

  const returnToOrders = () => {
    if (mileage === "") {
      alert("Prašome įvesti ridą");
      return;
    }
    saveStatus(status);
    router.push("/screens/orders");
  };

  return (
    <div style={layout.page}>
      <div style={styles.dashboard}>
        <div style={styles.dashboardTop}>
          <h1 style={text.pageTitle}>Užsakymas #{id}</h1>
          <div style={styles.dashboardActions}>
            <button
              className="app-btn app-btn-secondary"
              onClick={() =>
                setShowOrderDetailsSection(!showOrderDetailsSection)
              }
            >
              Rida ir darbai
            </button>

            <StatusDropdown status={status} setStatus={setStatus} />

            <button
              className="app-btn app-btn-primary"
              onClick={returnToOrders}
            >
              Grįžti į užsakymus
            </button>
          </div>
        </div>

        <CustomerCarInfo customer={customer} car={car} mileage={mileage} />

        {showOrderDetailsSection && returnOrderDetailsSection()}

        <div style={styles.totals}>
          <div style={styles.totalRow}>
            <span style={styles.totalLabelMuted}>Dalių savikaina</span>
            <span style={styles.totalValueMuted}>
              {formatPrice(totalPrice)}
            </span>
          </div>
          <div style={styles.totalRow}>
            <span style={styles.totalLabelMuted}>Darbai</span>
            <span style={styles.totalValueMuted}>{formatPrice(labor)}</span>
          </div>
          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Bendra suma</span>
            <span style={styles.totalValue}>
              {formatPrice(totalRetailPrice + toAmount(labor))}
            </span>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.partsHeaderContainer}>
          {showAddedParts && (
            <button
              className="app-btn app-btn-secondary"
              onClick={() => {
                setShowPartAddingSection(!showPartAddingSection);
                setShowAddedParts(!showAddedParts);
              }}
            >
              Pridėti dalis
            </button>
          )}
          {showPartAddingSection && (
            <button className="app-btn app-btn-primary" onClick={addOrderItems}>
              Išsaugoti
            </button>
          )}
        </div>
        {showPartAddingSection && returnPartAddingSection()}
        {showAddedParts && (
          <div style={styles.column}>
            <h2 style={text.sectionTitle}>Užsakymo dalys</h2>

            <div style={layout.content}>
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
  detailsForm: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-end",
    gap: space.md,
    paddingTop: space.lg,
    borderTop: `1px solid ${colors.border}`,
  },
  detailsField: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
    flex: "1 1 200px",
    maxWidth: "240px",
  },
  totals: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
    paddingTop: space.lg,
    borderTop: `1px solid ${colors.border}`,
  },
  totalRow: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: space.md,
  },
  totalLabel: {
    ...text.label,
  },
  totalLabelMuted: {
    ...text.label,
    color: colors.textSubtle,
  },
  totalValueMuted: {
    fontSize: "1rem",
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums",
    color: colors.textMuted,
  },
  priceStack: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "2px",
  },
  priceCost: {
    fontSize: "0.75rem",
    fontWeight: 500,
    color: colors.textMuted,
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
  partsHeaderContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: space.md,
    paddingBottom: space.md,
    borderBottom: `1px solid ${colors.border}`,
  },
};
