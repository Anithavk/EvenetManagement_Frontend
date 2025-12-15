import React from "react";
import { Link } from "react-router-dom";

export default function EventCard({ event }) {
  return (
    <Link to={`/events/${event._id}`}>
      <div className="border rounded-lg shadow-md p-3 sm:p-4 hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-40 sm:h-48 object-cover rounded-md mb-4"
          />
        )}

        <h2 className="text-lg sm:text-xl font-semibold mb-2 truncate">
          {event.title}
        </h2>

        <p className="text-gray-600 mb-2">
          {event.startDate
            ? new Date(event.startDate).toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "Date not available"}
        </p>

        <p className="text-gray-700 line-clamp-3">
          {event.description}
        </p>
      </div>
    </Link>
  );
}
