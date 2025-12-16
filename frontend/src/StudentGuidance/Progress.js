import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Lock, Star, ArrowRight, FileDown, Crown } from "lucide-react";
import PremiumPlans from "../components/PremiumPlans";

// ------------------------------------------------------------------
// LOCAL STORAGE PROGRESS SYSTEM
// ------------------------------------------------------------------
export const updateProgress = (stage) => {
  const saved = JSON.parse(localStorage.getItem("careerProgress")) || {};
  saved[stage] = true;
  localStorage.setItem("careerProgress", JSON.stringify(saved));
};

export const getProgress = () => {
  return JSON.parse(localStorage.getItem("careerProgress")) || {};
};

// ------------------------------------------------------------------
// BEAUTIFUL PROGRESS SIDEBAR WITH PREMIUM LOGIC
// ------------------------------------------------------------------
export default function ProgressSidebar() {
  const progress = getProgress();

  // ⭐ FIXED PREMIUM CHECK ⭐
  const user = JSON.parse(localStorage.getItem("user"));
  const isPremium = user?.isPremium === true;

  // ⭐ POPUP STATE
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);

  const openPremiumPopup = () => setShowPremiumPopup(true);

  const steps = [
    { id: "stage5to7", title: "5th–7th Guidance", link: "/student-guidance/5th-7th", premium: false },
    { id: "stage8to10", title: "8th–10th Guidance", link: "/student-guidance/8th-10th", premium: false },
    { id: "stage11to12", title: "11th–12th Guidance", link: "/student-guidance/11th-12th", premium: true },
  ];

  const getStatus = (index) => {
    const current = steps[index];

    // PREMIUM STEP LOCK LOGIC FIXED
    if (current.premium && !isPremium) {
      return "lockedpremium";
    }

    if (!progress[current.id]) {
      if (index === 0) return "active";

      const prev = steps[index - 1].id;
      return progress[prev] ? "active" : "locked";
    }

    return "completed";
  };

  // FINAL REPORT — ONLY FOR PREMIUM USERS WITH ALL COMPLETED
  const allCompleted =
    isPremium &&
    progress.stage5to7 &&
    progress.stage8to10 &&
    progress.stage11to12;

  return (
    <aside className="bg-white shadow-2xl border border-blue-100 rounded-3xl p-6 sticky top-24 w-72">

      {showPremiumPopup && (
        <PremiumPlans onClose={() => setShowPremiumPopup(false)} />
      )}

      <div className="mb-5 text-center">
        <h2 className="text-xl font-extrabold text-blue-800 flex items-center justify-center gap-2">
          <Star className="text-yellow-500" /> Your Career Journey
        </h2>
        <p className="text-gray-500 text-xs">Track your learning stages</p>
      </div>

      <div className="relative ml-4">
        <div className="absolute left-2 top-0 bottom-0 w-1 bg-gradient-to-b 
                        from-blue-300 via-blue-500 to-blue-800 rounded-full opacity-70"></div>

        {steps.map((step, index) => {
          const status = getStatus(index);

          return (
            <div key={step.id} className="relative flex items-start mb-10 last:mb-0">

              {/* ICON */}
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-full shadow-md bg-white z-10 border-2
                ${status === "completed"
                    ? "border-green-500 text-green-600"
                    : status === "active"
                      ? "border-blue-600 text-blue-600"
                      : status === "lockedpremium"
                        ? "border-yellow-500 text-yellow-600"
                        : "border-gray-300 text-gray-400"
                  }`}
              >
                {status === "completed" && <CheckCircle size={18} />}
                {status === "active" && <ArrowRight size={18} />}
                {status === "lockedpremium" && <Crown size={16} />}
                {status === "locked" && <Lock size={16} />}
              </div>

              {/* CARD */}
              <div
                className={`ml-4 px-4 py-3 w-52 rounded-xl shadow-lg border transition-all
                ${status === "completed"
                    ? "bg-green-50 border-green-200"
                    : status === "active"
                      ? "bg-blue-50 border-blue-200"
                      : status === "lockedpremium"
                        ? "bg-yellow-50 border-yellow-300"
                        : "bg-gray-100 border-gray-300 opacity-60"
                  }`}
              >
                <p className={`font-semibold text-sm mb-1
                  ${status === "completed"
                    ? "text-green-700"
                    : status === "active"
                      ? "text-blue-800"
                      : status === "lockedpremium"
                        ? "text-yellow-700"
                        : "text-gray-500"
                  }`}
                >
                  {step.title}
                </p>

                {/* BUTTONS */}
                {status === "lockedpremium" ? (
                  <button
                    onClick={openPremiumPopup}
                    className="text-xs text-yellow-700 underline flex items-center gap-1"
                  >
                    Unlock Premium <Crown size={12} />
                  </button>
                ) : status !== "locked" ? (
                  <Link
                    to={
                      step.id === "stage11to12"
                        ? "/student-guidance/final-report" // 👉 FOR 11–12 SHOW REPORT PAGE
                        : step.link
                    }
                    className="text-xs text-blue-600 underline flex items-center gap-1"
                  >
                    {step.id === "stage11to12"
                      ? "Generate Report" // 👉 CUSTOM TEXT FOR LAST STEP
                      : status === "completed"
                        ? "Next"
                        : "Continue"}{" "}
                    <ArrowRight size={12} />
                  </Link>
                ) : (
                  <p className="text-xs text-gray-400">Complete previous</p>
                )}

              </div>
            </div>
          );
        })}
      </div>

      {/* FINAL REPORT SECTION */}
      {allCompleted ? (
        <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-300 shadow text-center">
          <h3 className="font-bold text-green-700 mb-2 flex items-center justify-center gap-1">
            🎉 All Stages Completed!
          </h3>

          <Link
            to="/student-guidance/final-report"
            className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2
                       hover:bg-green-700 transition shadow-md"
          >
            <FileDown size={16} /> Download Full Report
          </Link>
        </div>
      ) : null}
    </aside>
  );
}
