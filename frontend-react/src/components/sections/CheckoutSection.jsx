import { useState } from "react";
import { useCart } from "../../context/CartContext";

export function CheckoutSection() {
  const { cartItems } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");

  const submitOrder = async () => {
    const orderData = {
      customerName,
      phone,
      pickupDate: "2026-06-01",
      pickupTime: "6:30 PM",
      comments: "",
      items: cartItems,
    };

    const response = await fetch("http://localhost:8080/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.text();

    console.log(result);
  };

  return (
    <div>
      <h1>Checkout</h1>

      <input
        placeholder="Name"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
      />

      <input
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button onClick={submitOrder}>
        Submit Order
      </button>
    </div>
  );
}