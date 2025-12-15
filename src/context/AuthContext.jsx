import React, { createContext, useState, useEffect } from "react";
import api from "../services/Api.jsx";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); 

  // 🔹 Initialize auth safely
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      } catch (err) {
        console.warn("Invalid auth data, clearing", err);
        localStorage.clear();
      }
    }

    setLoading(false); 
  }, []);

  // 🔹 Login
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      document.body.style.overflow = "auto"; // ✅ unblock UI
      navigate("/dashboard");
    } catch (err) {
      throw err.response?.data?.message || "Login failed";
    }
  };

  // 🔹 Register
  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    const { token, user } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setToken(token);
    setUser(user);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    navigate("/dashboard");
  };

  // 🔹 Logout
  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};
