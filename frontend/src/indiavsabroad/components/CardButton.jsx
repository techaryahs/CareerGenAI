export default function CardButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center
        p-6 w-full h-36
        rounded-2xl border
        bg-white
        transition-all duration-300
        hover:shadow-xl hover:-translate-y-1
        ${
          active
            ? "border-blue-500 bg-blue-50 shadow-lg"
            : "border-gray-200"
        }
      `}
    >
      <div
        className={`
          text-3xl mb-3
          ${active ? "text-blue-600" : "text-blue-500"}
        `}
      >
        {icon}
      </div>

      <p className="font-medium text-gray-800 text-sm text-center">
        {label}
      </p>
    </button>
  );
}
