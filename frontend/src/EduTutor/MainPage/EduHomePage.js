import React, { useState } from "react";

// ===============================
// IMPORT ALL STEPS AT TOP
// ===============================
import EduCareerSelect from "./EduCareerSelect";
import EduBranchSelect from "./EduBranchSelect";
import EduSemesterSelect from "./EduSemesterSelect";
import EduSubjectSelect from "./EduSubjectSelect";
import EduTutorList from "./EduTutorList";
import EduCartPage from "./EduCartPage";
import EduCheckoutPage from "./EduCheckoutPage";
import EduSuccessPage from "./EduSuccessPage";

// ===============================
// INLINE PROGRESS BAR COMPONENT
// ===============================
function ProgressBar({ step }) {
  const steps = [
    "Career",
    "Branch",
    "Semester",
    "Subjects",
    "Tutor",
    "Cart",
    "Checkout",
    "Success"
  ];

  const progress = ((step - 1) / (steps.length - 1)) * 100;

  return (
    <div className="mb-6">
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex justify-between mt-2 text-xs font-semibold text-gray-600">
        {steps.map((label, index) => (
          <div
            key={index}
            className={`transition-all duration-300 ${
              step - 1 === index
                ? "text-blue-600 font-bold"
                : step - 1 > index
                ? "text-green-600"
                : "text-gray-400"
            }`}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ===============================
// MAIN PAGE COMPONENT
// ===============================
export default function EduHomePage() {
  const [step, setStep] = useState(1);

  const [selectedCareer, setSelectedCareer] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);

  const [finalAmount, setFinalAmount] = useState(0);

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-2xl mx-auto">

      {/* Progress Bar */}
      <ProgressBar step={step} />

      {/* Back Button */}
      {step > 1 && step < 8 && (
        <button
          onClick={handleBack}
          className="mb-4 px-4 py-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300 transition"
        >
          ← Back
        </button>
      )}

      {/* Container */}
      <div className="bg-white rounded-xl shadow-xl p-6 border">

        {step === 1 && (
          <EduCareerSelect
            onSelect={(careerId) => {
              setSelectedCareer(careerId);
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <EduBranchSelect
            careerId={selectedCareer}
            onSelect={(branchId) => {
              setSelectedBranch(branchId);
              setStep(3);
            }}
          />
        )}

        {step === 3 && (
          <EduSemesterSelect
            branchId={selectedBranch}
            onSelect={(sem) => {
              setSelectedSemester(sem);
              setStep(4);
            }}
          />
        )}

        {step === 4 && (
          <EduSubjectSelect
            branchId={selectedBranch}
            semester={selectedSemester}
            selectedSubjects={selectedSubjects}
            setSelectedSubjects={setSelectedSubjects}
            onNext={() => setStep(5)}
          />
        )}

        {step === 5 && (
          <EduTutorList
            selectedSubjects={selectedSubjects}
            branchId={selectedBranch}
            onSelect={(tutor) => {
              setSelectedTutor(tutor);
              setStep(6);
            }}
          />
        )}

        {step === 6 && (
          <EduCartPage
            tutor={selectedTutor}
            selectedSubjects={selectedSubjects}
            branchId={selectedBranch}
            semester={selectedSemester}
            onCheckout={(amount) => {
              setFinalAmount(amount);
              setStep(7);
            }}
          />
        )}

        {step === 7 && (
          <EduCheckoutPage
            finalAmount={finalAmount}
            onSuccess={() => setStep(8)}
          />
        )}

        {step === 8 && <EduSuccessPage />}
      </div>
    </div>
  );
}
