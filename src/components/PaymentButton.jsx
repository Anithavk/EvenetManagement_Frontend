import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51SVrlZHqBHr0kTL9v2plLEPlAbJ31VjDl4bL9kPkCqMS09Y36XoiicKd87Ue8lTOvuH1Szm0OqmRfaBgzMGmSGXU001vzWf3el"); // Replace with your Stripe public key

export default function PaymentButton({ sessionId }) {
  const handleClick = async () => {
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId });
  };

  return (
    <button
      onClick={handleClick}
      className="bg-accent text-white px-6 py-2 rounded hover:bg-teal-600"
    >
      Pay Now
    </button>
  );
}
