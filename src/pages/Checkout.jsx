import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../services/Api.jsx";
import { AuthContext } from "../context/AuthContext";

export default function Checkout() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState("");

  // Load Event + Tickets
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Create Stripe Checkout Session
const createCheckoutSession = async () => {
  if (!selectedTicket) {
    alert("Please select a ticket type");
    return;
  }

  try {
    const res = await api.post(`/tickets/purchase`, {
      eventId: id,           // <-- fixed
      ticketTypeId: selectedTicket,
      quantity: 1,
    });

    // Redirect to Stripe
    window.location.href = res.data.url;

  } catch (err) {
    console.error(err);
    alert("Failed to start payment.");
  }
};


  if (loading) return <p>Loading event...</p>;
  if (!event) return <p>Event not found.</p>;
  if (!user) return <p>Please login to buy tickets.</p>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">{event.title}</h1>

      <p className="text-gray-600 mb-4">{event.description}</p>

      {/* TICKET TYPES DROPDOWN */}
      <label className="block mb-2 font-semibold">Choose Ticket Type</label>
      <select
        className="w-full p-2 border rounded mb-4"
        value={selectedTicket}
        onChange={(e) => setSelectedTicket(e.target.value)}
      >
        <option value="">-- Select Ticket --</option>
        {event.ticketTypes?.map((ticket) => (
          <option key={ticket._id} value={ticket._id}>
            {ticket.name} — {ticket.price}
          </option>
        ))}
      </select>

      <p className="mb-4 text-sm text-gray-700">
        You’ll be redirected to Stripe for a secure payment.
      </p>

      <button
        onClick={createCheckoutSession}
        className="bg-indigo-600 text-white w-full py-2 rounded hover:bg-indigo-700"
      >
        Proceed to Payment
      </button>
    </div>
  );
}
