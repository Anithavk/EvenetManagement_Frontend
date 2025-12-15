import { useState, useEffect } from "react";
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from "recharts";

export default function OrganizerAnalytics() {
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    // === FRONTEND STATIC DATA FOR NOW ===
    const sample = [
      {
        title: "Music Festival",
        ticketsSold: 320,
        totalTickets: 500,
        revenue: 64000,
      },
      {
        title: "Tech Summit",
        ticketsSold: 180,
        totalTickets: 300,
        revenue: 54000,
      },
      {
        title: "Food Carnival",
        ticketsSold: 450,
        totalTickets: 600,
        revenue: 90000,
      },
    ];
    setAnalytics(sample);
  }, []);

  const attendanceData = analytics.map(e => ({
    name: e.title,
    attendanceRate: Number(((e.ticketsSold / e.totalTickets) * 100).toFixed(2))
  }));

  const COLORS = ["#4F46E5", "#16A34A", "#DC2626"];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Event Analytics Dashboard</h1>

      {/* ===================== TICKETS SOLD ===================== */}
      <div className="bg-white shadow rounded p-4 mb-10">
        <h2 className="text-xl font-semibold mb-4">Tickets Sold</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ticketsSold" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ===================== REVENUE ===================== */}
      <div className="bg-white shadow rounded p-4 mb-10">
        <h2 className="text-xl font-semibold mb-4">Revenue ($)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#16A34A" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ===================== ATTENDANCE RATE PIE ===================== */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-4">Attendance Rate (%)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={attendanceData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="attendanceRate"
              label
            >
              {attendanceData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
