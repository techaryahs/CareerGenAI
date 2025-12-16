import React, { useEffect } from "react";
import { Link } from "react-router-dom";

// Progress system stored in StudentGuidance/Progress.js
import { updateProgress } from "../Progress";

export default function SectionResult({ result, handleDownload }) {

  // 🔥 Save Progress + Save Full Result for Final PDF
  useEffect(() => {
    updateProgress("stage5to7");

    // Store the full result object for Final Report PDF
    localStorage.setItem("stage5to7Result", JSON.stringify(result));
  }, []);

  return (
    <>
      {/* ---------------- HEADER SECTION ---------------- */}
      <section className="bg-gradient-to-br from-sky-500 to-sky-400 py-16 text-white text-center">
        
        <div className="text-6xl">{result.emoji}</div>

        <h1 className="text-4xl font-extrabold mt-3">
          You're a {result.title}!
        </h1>

        <p className="text-white/90 mt-4 text-lg max-w-2xl mx-auto">
          {result.description}
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <Link
            to="/student-guidance/8th-10th"
            className="bg-white/90 text-sky-700 px-6 py-2 rounded-lg shadow"
          >
            Next Level →
          </Link>
        </div>

      </section>

      {/* ---------------- DETAILS SECTION ---------------- */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-6">

          {/* SUBJECTS */}
          <div className="p-6 bg-sky-50 rounded-2xl">
            <h2 className="text-2xl font-bold text-sky-800 mb-3">
              Subjects You’ll Love
            </h2>

            {result.subjects.map((s, i) => (
              <div
                key={i}
                className="p-2 bg-white rounded-lg shadow-sm mb-3 flex items-center"
              >
                <div className="w-3 h-3 bg-sky-500 rounded-full mr-2"></div>
                <p>{s}</p>
              </div>
            ))}
          </div>

          {/* ACTIVITIES */}
          <div className="p-6 bg-sky-50 rounded-2xl">
            <h2 className="text-2xl font-bold text-sky-800 mb-3">
              Fun Activities
            </h2>

            {result.activities.map((a, i) => (
              <div
                key={i}
                className="flex items-center p-3 bg-white rounded-lg shadow-sm mb-3"
              >
                <div className="w-10 h-10 bg-sky-500 text-white flex items-center justify-center mr-3 rounded-full font-bold">
                  {i + 1}
                </div>
                <p>{a}</p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
