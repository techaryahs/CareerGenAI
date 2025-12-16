import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { updateProgress } from "../Progress";  // correct path

export default function SectionResult({ result }) {

  /*
      result = {
        stream,
        emoji,
        title,
        description,
        careers,
        paths
      }
  */

  // 🔥 Save progress + save full result for final PDF
  useEffect(() => {
    updateProgress("stage8to10");

    // Store full result for Final PDF
    localStorage.setItem("stage8to10Result", JSON.stringify(result));
  }, []);

  return (
    <>
      {/* ================== HEADER ================== */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-500 py-16 text-white text-center shadow-lg">
        
        <div className="text-6xl mb-3">{result.emoji}</div>

        <h1 className="text-4xl font-extrabold">
          Your Career Stream: {result.title}
        </h1>

        <p className="text-white/90 mt-4 text-lg max-w-3xl mx-auto">
          {result.description}
        </p>

        <div className="mt-6 flex justify-center gap-4">

          {/* 🔹 Next Level Navigation */}
          <Link
            to="/student-guidance/11th-12th"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow font-semibold hover:bg-blue-50 transition"
          >
            Proceed to 11th–12th →
          </Link>

          {/* 🔹 Retake Assessment */}
          <Link
            to="/student-guidance/8th-10th"
            className="bg-white/90 text-blue-700 px-6 py-3 rounded-lg shadow font-semibold hover:bg-white transition"
          >
            Retake Assessment
          </Link>

        </div>
      </section>

      {/* ================== DETAILS SECTION ================== */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8">

          {/* ================== CAREER OPTIONS ================== */}
          <div className="bg-blue-50 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              Recommended Careers
            </h2>

            <ul className="space-y-3">
              {result.careers.map((career, idx) => (
                <li
                  key={idx}
                  className="bg-white p-3 rounded-lg shadow flex items-center"
                >
                  <span className="w-3 h-3 bg-blue-600 rounded-full mr-3"></span>
                  {career}
                </li>
              ))}
            </ul>
          </div>

          {/* ================== LEARNING PATH ================== */}
          <div className="bg-blue-50 rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              Your Learning Path
            </h2>

            <ul className="space-y-3">
              {result.paths.map((path, idx) => (
                <li
                  key={idx}
                  className="bg-white p-3 rounded-lg shadow flex items-center"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mr-4 font-bold">
                    {idx + 1}
                  </div>
                  {path}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>
    </>
  );
}
