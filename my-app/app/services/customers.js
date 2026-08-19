import { supabase } from "./../supabaseClient";

export const AddCustomer = async (customerName, customerPhone, userId) => {
  if (!customerName.trim()) return;

  const { error } = await supabase.from("customers").insert([
    {
      // id: userId,
      name: customerName,
      phone_number: customerPhone,
    },
  ]);

  if (error) {
    console.error("Klaida pridedant vartotoją:", error.message);
  } else {
  }
};
