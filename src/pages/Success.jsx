import { useSearchParams } from "react-router-dom";

export default function Success() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");


  return (
    <div className="max-w-md mx-auto bg-white shadow p-6 rounded mt-10">
      <h1 className="text-2xl font-bold mb-3 text-green-600">
        Payment Successful!
      </h1>

      <p className="text-gray-700 mb-6">
        Thank you for your purchase.
      </p>

      <p className="text-sm text-gray-500">
        Payment Session ID:
        <br />
        <span className="font-mono">{sessionId}</span>
      </p>
    </div>
  );
}
