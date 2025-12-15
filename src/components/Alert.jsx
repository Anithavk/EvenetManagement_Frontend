export default function Alert({ message, type = "error" }) {
  const color = type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700";
  return (
    <div className={`p-3 rounded mb-4 ${color}`}>{message}</div>
  );
}
