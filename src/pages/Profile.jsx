import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/Api";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const payload = { name, email };
      if (password) payload.password = password;

      const { data } = await api.put("/users/profile", payload);

      setUser(data); // Update navbar immediately
      setMessage("Profile updated successfully");

      // Auto-hide success message after 3s
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      let msg =
        err.response?.data?.message || err.message || "Failed to update profile.";
      setError(msg);

      // Auto-hide error message after 3s
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 flex items-start justify-center bg-gray-100 p-2 sm:p-6 ">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">My Profile</h2>

        {message && (
          <div className="bg-green-100 text-green-700 p-2 mb-4 rounded text-sm sm:text-base">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm sm:text-base">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-sm sm:text-base">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 sm:p-3 rounded text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* <div>
            <label className="block mb-1 font-semibold text-sm sm:text-base">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 sm:p-3 rounded text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm sm:text-base">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 sm:p-3 rounded text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Leave blank to keep current password"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-sm sm:text-base">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border p-2 sm:p-3 rounded text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Leave blank to keep current password"
            />
          </div> */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 sm:p-3 rounded text-white font-semibold transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
