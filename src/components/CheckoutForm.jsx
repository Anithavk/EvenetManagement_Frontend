import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import React, { useState } from "react";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    alert("Stripe setup works!"); // temporary check

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement className="p-4 border rounded mb-4" />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-primary text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        {loading ? "Processing..." : "Pay"}
      </button>
    </form>
  );
}
