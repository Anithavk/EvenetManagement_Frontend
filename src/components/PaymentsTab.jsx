import { useEffect, useState } from "react";
import api from "../services/Api";

const PaymentsTab = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api.get("/admin/payments").then(res => {
      setPayments(res.data);
    });
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Payments</h2>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th>User</th>
            <th>Event</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p._id} className="border-t">
              <td>{p.user?.email}</td>
              <td>{p.event?.title}</td>
              <td>${p.totalAmount ? (p.totalAmount / 100).toFixed(2) : "0.00"}</td>
              <td>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentsTab;
