import { useEffect, useMemo, useState } from "react";
import EventCard from "../components/EventCard.jsx";

const API_URL = "http://localhost:4000/api/events";

/* ---------- HELPERS ---------- */

// Convert any date to YYYY-MM-DD safely
const normalizeDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d)) return "";
  return d.toISOString().slice(0, 10);
};

// Extract price safely
const extractPrice = (event) => {
  if (typeof event.price === "number") return event.price;
  if (typeof event.ticketPrice === "number") return event.ticketPrice;

  if (Array.isArray(event.ticketTypes) && event.ticketTypes.length > 0) {
    return Number(event.ticketTypes[0].price) || 0;
  }
  return 0;
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  /* ---------- FETCH ---------- */
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(API_URL, { cache: "no-store" });
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  /* ---------- DYNAMIC CATEGORIES ---------- */
  const categories = useMemo(
    () => [...new Set(events.map(e => e.category).filter(Boolean))],
    [events]
  );

  /* ---------- FILTER LOGIC (FIXED) ---------- */
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // SEARCH
      const text = `${event.title || ""} ${event.description || ""}`.toLowerCase();
      if (search && !text.includes(search.toLowerCase())) return false;

      // CATEGORY
      if (category && event.category !== category) return false;

      // LOCATION & DATE — SCHEDULE BASED ✅
      if (location || date) {
        if (!Array.isArray(event.schedules)) return false;

        const matchSchedule = event.schedules.some((s) => {
          const scheduleLocation = String(s.location || "").toLowerCase();
          const inputLocation = location.toLowerCase();

          const locationMatch = location
            ? scheduleLocation.includes(inputLocation)
            : true;

          const dateMatch = date
            ? normalizeDate(s.startTime) === date
            : true;

          return locationMatch && dateMatch;
        });

        if (!matchSchedule) return false;
      }

      // PRICE
      const price = extractPrice(event);
      if (minPrice && price < Number(minPrice)) return false;
      if (maxPrice && price > Number(maxPrice)) return false;

      return true;
    });
  }, [events, search, category, location, date, minPrice, maxPrice]);

  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setLocation("");
    setDate("");
    setMinPrice("");
    setMaxPrice("");
  };

  /* ---------- UI ---------- */
  if (loading) return <p className="p-4">Loading events...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="min-h-dvh p-4">
      <h1 className="text-2xl font-bold mb-4">Browse Events</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded"
        /> */}

        <input
          type="number"
          placeholder="Min ₹"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border px-3 py-2 rounded w-24"
        />

        <input
          type="number"
          placeholder="Max ₹"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border px-3 py-2 rounded w-24"
        />

        <button
          onClick={resetFilters}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

      {/* Events */}
      {filteredEvents.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No events found</p>
      )}
    </div>
  );
}
