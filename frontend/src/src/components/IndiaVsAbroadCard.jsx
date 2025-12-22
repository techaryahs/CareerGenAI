import { useNavigate } from "react-router-dom";

export default function IndiaVsAbroadCard() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/india-vs-abroad")}
      className="bg-white p-8 rounded-2xl shadow-xl cursor-pointer hover:scale-105 transition"
    >
      <h2 className="text-2xl font-bold text-indigo-700">
        India vs Abroad
      </h2>
      <p className="text-gray-600 mt-2">
        Compare where to study based on your field
      </p>
    </div>
  );
}
