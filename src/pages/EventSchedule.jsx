import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/Api";

export default function EventSchedule() {
  const { eventId } = useParams();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await api.get(`/events/${eventId}/schedules`);
        setSchedules(res.data || []);
      } catch (err) {
        console.error("Failed to load schedules", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [eventId]);

  if (loading) {
    return <p className="text-center mt-10">Loading schedule...</p>;
  }

  if (schedules.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-10">
        No schedules published yet.
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Event Schedule</h2>

      <div className="space-y-6">
        {schedules.map((s) => (
          <div
            key={s._id}
            className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
              <div>
                <h3 className="text-xl font-semibold">{s.title}</h3>
                {s.speaker && (
                  <p className="text-sm text-gray-600">
                    🎤 Speaker: <span className="font-medium">{s.speaker}</span>
                  </p>
                )}
              </div>

              <div className="text-sm text-gray-700">
                <p>
                  ⏰{" "}
                  {new Date(s.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  –{" "}
                  {new Date(s.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p>
                  📅{" "}
                  {new Date(s.startTime).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {s.description && (
              <p className="text-gray-700 mt-3">{s.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
