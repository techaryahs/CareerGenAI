import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import SectionHero from "./SectionHero";
import SectionCareerStreams from "./SectionCareerStreams";
import SectionTrending from "./SectionTrending";
import AssessmentComponent from "./AssessmentComponent";
import ProgressSidebar from "../Progress";

export default function Grade11to12Home() {
  const navigate = useNavigate();

  // ⭐ FIX: PREMIUM CHECK FOR THIS PAGE ⭐
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("11–12 Page → Premium status:", user?.isPremium);

    if (!user?.isPremium) {
      console.log("User NOT premium → redirecting to /pricing");
      navigate("/pricing");
    }
  }, [navigate]);

  return (
    <div className="bg-gradient-to-br from-[#d7efff] to-[#f1faff] min-h-screen flex w-full">

      {/* LEFT MAIN CONTENT */}
      <main className="w-full md:w-[70%] px-6 md:px-12 lg:px-20 py-10">
        <SectionHero />
        <SectionCareerStreams />
        <SectionTrending />

        <section id="assessment" className="mt-20 mb-10">
          <AssessmentComponent />
        </section>
      </main>

      {/* RIGHT PROGRESS SIDEBAR */}
      <div className="hidden md:block w-[30%] pr-6">
        <ProgressSidebar />
      </div>

    </div>
  );
}
