import React, { useMemo } from "react";
import { EDU_SUBJECTS } from "../data/EduSubjects";

export default function EduCartPage({ tutor, selectedSubjects, onCheckout }) {

  // -------------------------------
  // 🧮 GET SUBJECT DETAILS
  // -------------------------------
  const selectedSubjectDetails = useMemo(() => {
    let list = [];

    for (let branch in EDU_SUBJECTS) {
      for (let sem in EDU_SUBJECTS[branch]) {
        EDU_SUBJECTS[branch][sem].forEach((sub) => {
          if (selectedSubjects.includes(sub.id)) {
            list.push(sub);
          }
        });
      }
    }

    return list;
  }, [selectedSubjects]);

  // -------------------------------
  // 🧮 CALCULATE PRICES
  // -------------------------------
  const subjectTotal = selectedSubjectDetails.reduce((sum, s) => sum + s.price, 0);
  const tutorPrice = tutor?.price || 0;
  const finalTotal = subjectTotal + tutorPrice;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>

      {/* Selected Subjects */}
      <h3 className="font-bold mb-2">Selected Subjects:</h3>
      {selectedSubjectDetails.map((sub) => (
        <div key={sub.id} className="p-3 bg-gray-100 rounded mb-2">
          {sub.name} – ₹{sub.price}
        </div>
      ))}

      {/* Total */}
      <div className="mt-4 p-4 bg-blue-100 rounded">
        <h3 className="text-lg font-bold">Total Amount: ₹{finalTotal}</h3>
      </div>

      <button
        onClick={() => onCheckout(finalTotal)}
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
