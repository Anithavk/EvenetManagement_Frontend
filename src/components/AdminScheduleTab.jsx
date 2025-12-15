import { useState, useEffect } from "react";
import api from "../services/Api";

export default function AdminScheduleTab() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionForm, setSessionForm] = useState({
    _id: null,
    title: "",
    startTime: "",
    endTime: "",
    speaker: "",
    location: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  // Fetch all events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/admin/events-analytics");
        setEvents(res.data);
        if (res.data.length > 0) setSelectedEvent(res.data[0]);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (!events.length) return <p>No events available.</p>;

  // Change selected event
  const handleEventChange = (e) => {
    const event = events.find(ev => ev._id === e.target.value);
    setSelectedEvent(event);
    setSessionForm({ _id: null, title: "", startTime: "", endTime: "", speaker: "", location: "", description: "" });
  };

  // Handle form input changes
  const handleSessionChange = (e) => {
    const { name, value } = e.target;
    setSessionForm(prev => ({ ...prev, [name]: value }));
  };

  // Save session (add or update)
  const saveSession = async () => {
    if (!selectedEvent) return;
    setSaving(true);
    try {
      if (sessionForm._id) {
        // Update existing session
        const res = await api.put(`/events/${selectedEvent._id}/schedules`, sessionForm);
        const updatedSchedule = res.data.schedule;
        setSelectedEvent(prev => ({
          ...prev,
          schedules: prev.schedules.map(s => s._id === updatedSchedule._id ? updatedSchedule : s),
        }));
        alert("Session updated successfully!");
      } else {
        // Add new session
        const res = await api.post(`/events/${selectedEvent._id}/schedules`, sessionForm);
        const newSchedule = res.data.schedule;
        setSelectedEvent(prev => ({
          ...prev,
          schedules: [...(prev.schedules || []), newSchedule],
        }));
        alert("Session added successfully!");
      }
      setSessionForm({ _id: null, title: "", startTime: "", endTime: "", speaker: "", location: "", description: "" });
    } catch (err) {
      console.error("Failed to save session:", err);
      alert("Failed to save session");
    } finally {
      setSaving(false);
    }
  };

  // Edit session
  const editSession = (s) => {
    setSessionForm({
      _id: s._id,
      title: s.title || "",
      startTime: s.startTime ? new Date(s.startTime).toISOString().slice(0,16) : "",
      endTime: s.endTime ? new Date(s.endTime).toISOString().slice(0,16) : "",
      speaker: s.speaker || "",
      location: s.location || "",
      description: s.description || "",
    });
  };

  // Delete session
  const removeSession = async (_id) => {
    if (!selectedEvent) return;
    if (!window.confirm("Are you sure you want to remove this session?")) return;

    try {
      const res = await api.delete(`/events/${selectedEvent._id}/schedules/${_id}`);
      const removedSchedule = res.data.schedule;
      setSelectedEvent(prev => ({
        ...prev,
        schedules: prev.schedules.filter(s => s._id !== removedSchedule._id),
      }));
      alert("Session removed successfully!");
      setSessionForm({ _id: null, title: "", startTime: "", endTime: "", speaker: "", location: "", description: "" });
    } catch (err) {
      console.error("Failed to remove session:", err);
      alert("Failed to remove session");
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded space-y-6">
      <h2 className="text-2xl font-bold">Admin Schedule Management</h2>

      <div>
        <label className="block font-semibold mb-2">Select Event:</label>
        <select
          className="border px-3 py-2 rounded w-full max-w-md"
          onChange={handleEventChange}
          value={selectedEvent?._id || ""}
        >
          {events.map(ev => (
            <option key={ev._id} value={ev._id}>{ev.title}</option>
          ))}
        </select>
      </div>

      {selectedEvent && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Sessions</h3>
          {selectedEvent.schedules && selectedEvent.schedules.length > 0 ? (
            selectedEvent.schedules.map((s) => (
              <div key={s._id} className="p-3 border rounded flex justify-between items-center">
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="text-sm">{new Date(s.startTime).toLocaleString()} - {new Date(s.endTime).toLocaleString()} | {s.location}</p>
                  {s.speaker && <p className="text-sm">Speaker: {s.speaker}</p>}
                  {s.description && <p className="text-sm">{s.description}</p>}
                </div>
                <div className="space-x-2">
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded" onClick={() => editSession(s)}>Edit</button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => removeSession(s._id)}>Remove</button>
                </div>
              </div>
            ))
          ) : <p>No sessions yet for this event.</p>}

          <div className="mt-4 border-t pt-4">
            <h3 className="font-semibold mb-2">{sessionForm._id ? "Edit Session" : "Add New Session"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" name="title" placeholder="Session Title" className="border p-2 rounded w-full" value={sessionForm.title} onChange={handleSessionChange} />
              <input type="datetime-local" name="startTime" className="border p-2 rounded w-full" value={sessionForm.startTime} onChange={handleSessionChange} />
              <input type="datetime-local" name="endTime" className="border p-2 rounded w-full" value={sessionForm.endTime} onChange={handleSessionChange} />
              <input type="text" name="speaker" placeholder="Speaker" className="border p-2 rounded w-full" value={sessionForm.speaker} onChange={handleSessionChange} />
              <input type="text" name="location" placeholder="Location" className="border p-2 rounded w-full" value={sessionForm.location} onChange={handleSessionChange} />
              <input type="text" name="description" placeholder="Description" className="border p-2 rounded w-full" value={sessionForm.description} onChange={handleSessionChange} />
            </div>
            <button
              className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              onClick={saveSession}
              disabled={saving}
            >
              {saving ? "Saving..." : sessionForm._id ? "Update Session" : "Add Session"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
