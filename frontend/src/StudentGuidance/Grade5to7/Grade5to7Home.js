import React, { useState } from "react";
import SectionStart from "./SectionStart";
import SectionDiscover from "./SectionDiscover";
import SectionQuiz from "./SectionQuiz";
import SectionResult from "./SectionResult";

import { questions, resultsMap } from "./data";
import { jsPDF } from "jspdf";

import ProgressSidebar from "../Progress";   // ✅ PROGRESS BAR ADDED

export default function Grade5to7Home() {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  /* ------------------------------------
        START QUIZ
  ------------------------------------ */
  const handleStart = () => {
    setStarted(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  /* ------------------------------------
        ANSWER CLICK
  ------------------------------------ */
  const handleAnswer = (type) => {
    const updated = [...answers, type];
    setAnswers(updated);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
    } else {
      calculateResult(updated);
    }
  };

  /* ------------------------------------
        CALCULATE FINAL RESULT
  ------------------------------------ */
  const calculateResult = (finalAnswers) => {
    const count = {};

    finalAnswers.forEach((a) => {
      count[a] = (count[a] || 0) + 1;
    });

    const top = Object.keys(count).reduce((a, b) =>
      count[a] >= count[b] ? a : b
    );

    setResult(resultsMap[top]);
  };

  /* ------------------------------------
        PREVIOUS BUTTON
  ------------------------------------ */
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((q) => q - 1);
      setAnswers((a) => a.slice(0, -1));
    }
  };

  /* ------------------------------------
        DOWNLOAD REPORT
  ------------------------------------ */
  const handleDownload = () => {
    try {
      const doc = new jsPDF();
      doc.text("CareerGenAI Report", 20, 20);
      doc.save("report.pdf");
    } catch {
      alert("jsPDF not installed");
    }
  };

  const progressPercent = Math.round(
    ((currentQuestion + 1) / questions.length) * 100
  );

  /* ------------------------------------
        FINAL PAGE LAYOUT WITH PROGRESS BAR
  ------------------------------------ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex">

      {/* LEFT CONTENT AREA */}
      <div className="w-full md:w-[70%] px-6 py-10">

        {/* START + DISCOVER SCREEN */}
        {!started && !result && (
          <>
            <SectionStart handleStart={handleStart} />
            <SectionDiscover />
          </>
        )}

        {/* RESULT SCREEN */}
        {result && (
          <SectionResult result={result} handleDownload={handleDownload} />
        )}

        {/* QUIZ SCREEN */}
        {!result && started && (
          <SectionQuiz
            questions={questions}
            currentQuestion={currentQuestion}
            handleAnswer={handleAnswer}
            handlePrevious={handlePrevious}
            progressPercent={progressPercent}
          />
        )}
      </div>

      {/* RIGHT PROGRESS SIDEBAR */}
      <div className="hidden md:block w-[30%] pr-6">
        <ProgressSidebar />
      </div>

    </div>
  );
}
