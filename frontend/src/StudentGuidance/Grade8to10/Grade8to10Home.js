import React, { useState } from "react";

import SectionHero from "./SectionHero";
import SectionServices from "./SectionServices";
import SectionWhyUs from "./SectionWhyUs";
import SectionCareers from "./SectionCareers";
import SectionTestimonials from "./SectionTestimonials";

import SectionQuiz from "./SectionQuiz";
import SectionResult from "./SectionResult";

import ProgressSidebar from "../Progress";   // ✅ ADD THIS

export default function Grade8to10Home() {
  const [finalResult, setFinalResult] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex">

      {/* LEFT SIDE CONTENT */}
      <div className="w-full md:w-[70%] px-6 md:px-12 lg:px-16 py-10">

        {/* ---------------- HERO SECTION ---------------- */}
        <SectionHero />

        {/* ---------------- QUIZ OR RESULT ---------------- */}
        {!finalResult ? (
          <SectionQuiz onComplete={(data) => setFinalResult(data)} />
        ) : (
          <SectionResult result={finalResult} />
        )}

        {/* ---------------- EXTRA INFO SECTIONS (ONLY BEFORE RESULT) ---------------- */}
        {!finalResult && (
          <>
            <SectionServices />
            <SectionWhyUs />
            <SectionCareers />
            <SectionTestimonials />
          </>
        )}
      </div>

      {/* RIGHT SIDE PROGRESS SIDEBAR */}
      <div className="hidden md:block w-[30%] pr-6">
        <ProgressSidebar />
      </div>

    </div>
  );
}
