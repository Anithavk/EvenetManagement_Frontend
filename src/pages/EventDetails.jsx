import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/Api";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error("Failed to load event", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading event...</p>;
  if (!event) return <p className="text-center mt-10">Event not found.</p>;

  const isEventOver = new Date(event.endDate) < new Date();

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6">
      
      {/* ----------- Image Gallery ----------- */}
      {event.images?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {event.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Event image ${idx + 1}`}
              className="w-full h-64 object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      {/* ----------- Title ----------- */}
      <h1 className="text-4xl font-bold mb-4">{event.title}</h1>

      {/* ----------- Description ----------- */}
      <p className="text-gray-700 text-lg leading-relaxed mb-6">
        {event.description}
      </p>

      {/* ----------- Event Info ----------- */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6 space-y-1">
        <p>
          <strong>Start:</strong>{" "}
          {new Date(event.startDate).toLocaleString("en-IN")}
        </p>
        <p>
          <strong>End:</strong>{" "}
          {new Date(event.endDate).toLocaleString("en-IN")}
        </p>
        <p>
          <strong>Location:</strong>{" "}
          {event.location?.city}, {event.location?.country}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className="capitalize">{event.status}</span>
        </p>
      </div>

      {/* ----------- Videos ----------- */}
      {event.videos?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">Event Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {event.videos.map((video, idx) => (
              <video
                key={idx}
                controls
                className="w-full h-64 rounded-lg bg-black"
              >
                <source src={video} type="video/mp4" />
              </video>
            ))}
          </div>
        </div>
      )}

      {/* ----------- Action Buttons ----------- */}
      <div className="flex flex-wrap gap-4">
        <Link
          to={`/events/${event._id}/schedule`}
          className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900"
        >
          View Schedule
        </Link>

        <button
          disabled={isEventOver}
          onClick={() => navigate(`/checkout/${event._id}`)}
          className={`px-6 py-3 rounded-lg text-white ${
            isEventOver
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isEventOver ? "Event Ended" : "Buy Ticket"}
        </button>
      </div>
    </div>
  );
}
