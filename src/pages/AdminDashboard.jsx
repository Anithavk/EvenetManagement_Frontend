import { useState } from "react";
import AnalyticsTab from "../components/AnalyticsTab";
import EventsTab from "../components/EventsTab";
import UsersTab from "../components/UsersTab";
import PaymentsTab from "../components/PaymentsTab";
import ScheduleTab from "../components/AdminScheduleTab";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {["analytics", "events", "users", "payments","schedules"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? "bg-indigo-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "analytics" && <AnalyticsTab />}
      {activeTab === "events" && <EventsTab />}
      {activeTab === "users" && <UsersTab />}
      {activeTab === "payments" && <PaymentsTab />}
      {activeTab === "schedules" && <ScheduleTab />}
      
    </div>
  );
};

export default AdminDashboard;
