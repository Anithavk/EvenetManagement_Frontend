import { useEffect, useState } from "react";
import api from "../services/Api";

const EventsTab = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/admin/events-analytics");
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Only update status locally, keep other fields intact
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/events/${id}/status`, { status });

      setEvents(prev =>
        prev.map(e => (e._id === id ? { ...e, status } : e))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update event status. Please try again.");
    }
  };

  if (loading) return <p>Loading events...</p>;
  if (!events.length) return <p>No events found.</p>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Event Listings</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Event</th>
              <th className="p-2 border">Tickets Sold</th>
              <th className="p-2 border">Revenue ($)</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e._id} className="border-t hover:bg-gray-50">
                <td className="p-2 border">{e.title}</td>
                <td className="p-2 border text-center">{e.ticketsSold}</td>
                <td className="p-2 border text-center">${e.revenue}</td>
                <td className="p-2 border text-center">
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${
                      e.status === "approved"
                        ? "bg-green-600"
                        : e.status === "rejected"
                        ? "bg-red-600"
                        : e.status === "draft"
                        ? "bg-gray-600"
                        : "bg-blue-600"
                    }`}
                  >
                    {e.status}
                  </span>
                </td>
                <td className="p-2 border text-center space-x-2">
                  <button
                    onClick={() => updateStatus(e._id, "approved")}
                    className="px-2 py-1 bg-green-600 text-white rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(e._id, "rejected")}
                    className="px-2 py-1 bg-red-600 text-white rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsTab;
