import { Link } from "react-router-dom";

export default function Home() {
  return (
    // flex-1 so it takes remaining space inside the container above
 <section className="flex-1 flex flex-col justify-center items-center px-4 py-10">
  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center">
    Discover and Manage Events Effortlessly
  </h1>

  <p className="text-gray-600 text-base sm:text-lg md:text-xl mb-6 max-w-xl text-center">
    Join, create, and manage your favorite events with ease.
  </p>

  <Link
    to="/events"
    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
  >
    Browse Events
  </Link>
</section>

  );
}

