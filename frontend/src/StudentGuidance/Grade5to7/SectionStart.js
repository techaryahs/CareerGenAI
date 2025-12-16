import React from "react";

export default function SectionStart({ handleStart }) {
  return (
    <section className="bg-gradient-to-br from-sky-500 to-sky-400 py-20 text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="mx-auto w-28 h-28 rounded-full bg-white/20 flex items-center justify-center mb-6 shadow-lg">
          <div className="text-4xl">✨</div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Discover What You Love!
        </h1>

        <p className="text-lg md:text-xl text-white/90 mb-8">
          A fun quiz for Class 5–7 students to find interests & strengths.
        </p>

        <button
          onClick={handleStart}
          className="bg-white text-sky-600 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-2xl transition"
        >
          Start Quiz
        </button>
      </div>
    </section>
  );
}
