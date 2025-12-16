import React from "react";
import { EDU_CAREERS } from "../data/EduCareers";

export default function EduCareerSelect({ onSelect }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Select Your Career Path
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {EDU_CAREERS.map((career) => (
          <div
            key={career.id}
            onClick={() => onSelect(career.id)}
            className="p-4 bg-gray-100 rounded-xl shadow cursor-pointer 
                       hover:bg-blue-100 hover:shadow-lg transition-all"
          >
            <p className="text-lg font-semibold text-gray-700">
              {career.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
