import axios from "axios";

const api = axios.create({
  baseURL: "https://event-backend-0f5t.onrender.com/api",
   headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  validateStatus: () => true,
});
export default api;



