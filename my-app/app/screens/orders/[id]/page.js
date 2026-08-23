"use client";
import { supabase } from "./../../../supabaseClient"; // Importuojame klientą
import { use, useState, useEffect } from "react";
import CustomerCarInfo from "../../../components/CustomerCarInfo";
import PartsCard from "../../../components/PartsCard";
import CustomButton from "../../../components/UI/CustomButton";

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

  useEffect(() => {
    fetchOrderDetails();
    fetchParts();
  }, []);

  useEffect(() => {
    fetchOrderItems();
    console.log("Order items fetched:", orderItems);
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
      const { data, error } = await supabase.from("order_items").insert([
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
        console.log("Užsakymo elementas pridėtas:", data);

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
            <p>Part Number: {part.partNumber}</p>
            <p>Quantity: {part.quantity}</p>
          </>
        }
        price={`Price: ${part.price}`}
      />
    ));
  };

  const returnPartAddingSection = () => {
    return (
      <div style={styles.partAddingSection}>
        <div style={styles.leftSection}>{returnAvailableParts()}</div>
        <div style={styles.rightSection}>{returnAddedParts()}</div>
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
        details={<p>Part Number: {part.partNumber}</p>}
        price={`Price: ${part.price}`}
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
          "Unknown Part"
        }
        details={
          <>
            <p>
              Part Number:{" "}
              {parts.find((part) => part.id === orderItem.part_id)
                ?.partNumber || "Unknown Part"}
            </p>
            <p>Quantity: {orderItem.quantity}</p>
          </>
        }
        price={`Price: ${orderItem.price_at_sale}`}
      />
    ));
  };
  return (
    <div style={styles.root}>
      <div style={styles.dashboard}>
        <CustomerCarInfo customer={customer} car={car} />
        <p>Total: {totalPrice}</p>
        <CustomButton onClick={addOrderItems} ButtonText={"Save"} />
        <CustomButton
          onClick={() => {
            setShowPartAddingSection(!showPartAddingSection);
            setShowAddedParts(!showAddedParts);
          }}
          ButtonText={"Add Parts"}
        />
      </div>
      <div style={styles.content}>
        {showPartAddingSection && returnPartAddingSection()}
        {showAddedParts && showOrderItems()}
      </div>
    </div>
  );
}

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    width: "100%",
  },
  dashboard: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  content: {
    flex: 5,
    backgroundColor: "#b34c4c",
  },
  partAddingSection: {
    display: "flex",
  },
  leftSection: {
    flex: 1,
    backgroundColor: "#e0e0e0",
  },
  rightSection: {
    flex: 1,
    backgroundColor: "#d0d0d0",
  },
};
