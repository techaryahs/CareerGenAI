import React from "react";
import { EDU_SEMESTERS } from "../data/EduSemesters";

export default function EduSemesterSelect({ branchId, onSelect }) {
  const semesters = EDU_SEMESTERS[branchId] || [];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Select Semester
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {semesters.map((sem) => (
          <div
            key={sem}
            onClick={() => onSelect(sem)}
            className="p-4 bg-gray-100 rounded-xl shadow cursor-pointer 
                       hover:bg-blue-100 hover:shadow-lg transition-all"
          >
            <p className="text-lg font-semibold text-gray-700">
              Semester {sem}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
