import React from "react";
import { EDU_SUBJECTS } from "../data/EduSubjects";

export default function EduSubjectSelect({
  branchId,
  semester,
  selectedSubjects,
  setSelectedSubjects,
  onNext,
}) {
  // Fetch subjects correctly
  const subjects = EDU_SUBJECTS?.[branchId]?.[semester] || [];

  const toggleSubject = (id) => {
    setSelectedSubjects((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Select Subjects (Sem {semester})
      </h2>

      {subjects.length === 0 && (
        <p className="text-gray-500">No subjects found.</p>
      )}

      <div className="space-y-3">
        {subjects.map((sub) => (
          <div
            key={sub.id}
            onClick={() => toggleSubject(sub.id)}
            className={`p-4 border rounded-xl cursor-pointer shadow 
                        transition-all ${
                          selectedSubjects.includes(sub.id)
                            ? "bg-blue-200 border-blue-500"
                            : "bg-gray-100"
                        }`}
          >
            <p className="font-semibold text-gray-800">{sub.name}</p>
            <p className="text-gray-600">₹{sub.price}</p>
          </div>
        ))}
      </div>

      <button
        disabled={selectedSubjects.length === 0}
        onClick={onNext}
        className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl
                   disabled:bg-gray-400 transition-all"
      >
        Continue
      </button>
    </div>
  );
}
