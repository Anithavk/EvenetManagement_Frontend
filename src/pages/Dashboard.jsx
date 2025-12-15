import { useEffect, useContext, useState } from "react";
import api from "../services/Api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch tickets from /api/tickets/my
        const [ticketRes, eventsRes] = await Promise.all([
          api.get("/tickets/my"),
          api.get("/users/upcoming-events"),
        ]);

        console.log("Tickets:", ticketRes.data); // for debugging
        setTickets(ticketRes.data || []);
        setUpcomingEvents(eventsRes.data || []);
      } catch (err) {
        console.error("Dashboard loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadData();
  }, [user]);

  // Download ticket handler
  const handleDownload = async (ticketId) => {
  try {
    const res = await api.get(`/tickets/${ticketId}/download`, {
      responseType: "blob", // <- very important
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ticket-${ticketId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("Ticket download failed:", err);
    alert("Failed to download ticket. Please try again.");
  }
};


  if (!user)
    return (
      <p className="text-center mt-10 text-red-600 font-semibold">
        Please login to continue.
      </p>
    );

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}</h1>

      {/* Upcoming Events */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Your Upcoming Events</h2>
        {upcomingEvents.length === 0 ? (
          <p className="text-gray-500">No upcoming events registered.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {upcomingEvents.map((event) => (
              <div
                key={event._id}
                className="p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-gray-500 text-sm mt-1">
                  {event.location?.venue}, {event.location?.city},{" "}
                  {event.location?.state}
                </p>
                <p className="text-gray-700 mt-2 font-medium">
                  {new Date(event.startDate).toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
               
                <button
                  onClick={() => navigate(`/events/${event._id}`)}
                  className="mt-4 bg-blue-600 text-white py-1 px-3 rounded text-sm"
                >
                  View Event
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Purchased Tickets */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Purchased Tickets</h2>
        {tickets.length === 0 ? (
          <p className="text-gray-500">
            You haven’t purchased any tickets yet.
          </p>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg">{ticket.event.title}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Ticket ID:{" "}
                      <span className="font-mono">
                        {ticket._id || ticket.ticketType || "N/A"}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleDownload(ticket._id)}
                    className="bg-green-600 text-white py-1 px-3 rounded text-sm"
                  >
                    Download Ticket
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
