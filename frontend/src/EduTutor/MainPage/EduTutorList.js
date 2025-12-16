import React from "react";
import { EDU_TUTORS } from "../data/EduTutors";
import { EDU_SUBJECTS } from "../data/EduSubjects";

export default function EduTutorList({ selectedSubjects, branchId, onSelect }) {
  
  // Filter tutors by branch + selected subjects
  const filteredTutors = EDU_TUTORS.filter(
    (tutor) =>
      tutor.branch === branchId &&
      tutor.subjects.some((sub) => selectedSubjects.includes(sub))
  );

  // Convert subject IDs → subject names
  const getSubjectNames = (subjectIds) => {
    const names = [];

    Object.keys(EDU_SUBJECTS[branchId] || {}).forEach((sem) => {
      EDU_SUBJECTS[branchId][sem].forEach((sub) => {
        if (subjectIds.includes(sub.id)) names.push(sub.name);
      });
    });

    return names;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Available Tutors
      </h2>

      {filteredTutors.length === 0 && (
        <p className="text-gray-500">No tutors available for selected subjects.</p>
      )}

      <div className="space-y-4">
        {filteredTutors.map((tutor) => {
          const subjectNames = getSubjectNames(tutor.subjects);

          return (
            <div
              key={tutor.id}
              onClick={() => onSelect(tutor)}
              className="p-5 bg-gray-100 rounded-xl shadow cursor-pointer 
                         hover:bg-blue-100 hover:shadow-lg transition-all"
            >
              {/* Tutor Header */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-gray-900">{tutor.name}</h3>
                <span className="text-sm bg-blue-600 text-white px-3 py-1 rounded-full">
                  ₹{tutor.price}
                </span>
              </div>

              {/* Tutor Details */}
              <p className="text-gray-700"><strong>Branch:</strong> {tutor.branch.toUpperCase()}</p>
              <p className="text-gray-700"><strong>Experience:</strong> {tutor.experience}</p>
              <p className="text-gray-700"><strong>Rating:</strong> ⭐ {tutor.rating}</p>
              <p className="text-gray-700"><strong>Mode:</strong> {tutor.mode}</p>

              {/* Subjects */}
              <div className="mt-2">
                <p className="font-semibold text-gray-800">Subjects:</p>
                <ul className="list-disc ml-6 text-gray-700">
                  {subjectNames.map((sub, index) => (
                    <li key={index}>{sub}</li>
                  ))}
                </ul>
              </div>

              {/* Slots */}
              <div className="mt-3">
                <p className="font-semibold text-gray-800">Available Slots:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {tutor.slots.map((slot, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
