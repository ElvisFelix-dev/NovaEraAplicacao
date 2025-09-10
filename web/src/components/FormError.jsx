
export default function FormError({ message }) {
  if (!message) return null;
  return (
    <div className="relative w-full">
      <div className="absolute -top-4 -right-5 bg-red-500 text-white text-xs px-3 py-1 rounded-lg shadow-lg z-10">
        {message}
        <div className="absolute left-2 bottom-[-6px] w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 border-t-red-500"></div>
      </div>
    </div>
  );
}
