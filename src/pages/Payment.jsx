import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Payment() {
  // const { id } = useParams();
  // const navigate = useNavigate();
  // const [event, setEvent] = useState(null);
  // const [loading, setLoading] = useState(true);
  // const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });
  // const [error, setError] = useState("");

  // useEffect(() => {
  //   fetch(`${process.env.REACT_APP_API_URL}/api/events/${id}`)
  //     .then(res => res.json())
  //     .then(data => { setEvent(data); setLoading(false); })
  //     .catch(err => console.error(err));
  // }, [id]);

  // const handleChange = (e) => setCard({ ...card, [e.target.name]: e.target.value });

  // const handlePayment = async (e) => {
  //   e.preventDefault();
  //   if (!card.number || !card.expiry || !card.cvc) {
  //     setError("Fill all card details");
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem("jwtToken");
  //     const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ eventId: id }),
  //     });
  //     const data = await res.json();
  //     if (!res.ok) throw new Error(data.message || "Payment failed");
  //     alert("Payment Successful!");
  //     navigate("/dashboard");
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  // if (loading) return <p>Loading event...</p>;

  // return (
  //   <div className="max-w-md mx-auto bg-white shadow p-6 rounded-xl mt-6">
  //     <h2 className="text-2xl font-bold mb-4">Payment for {event.title}</h2>
  //     {error && <p className="text-red-500 mb-3">{error}</p>}
  //     <form onSubmit={handlePayment} className="space-y-4">
  //       <input type="text" name="number" placeholder="Card Number" value={card.number} onChange={handleChange} className="w-full border p-3 rounded" />
  //       <input type="text" name="expiry" placeholder="MM/YY" value={card.expiry} onChange={handleChange} className="w-full border p-3 rounded" />
  //       <input type="text" name="cvc" placeholder="CVC" value={card.cvc} onChange={handleChange} className="w-full border p-3 rounded" />
  //       <button type="submit" className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700">Pay ${event.price}</button>
  //     </form>
  //   </div>
  // );
}
