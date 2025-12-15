export default function Button({ children, className, ...props }) {
  return (
    <button
      className={`bg-primary text-white px-4 py-2 rounded hover:bg-indigo-700 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
