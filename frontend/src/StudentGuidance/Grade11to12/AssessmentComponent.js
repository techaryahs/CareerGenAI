import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QUESTIONS } from "./data";
import { updateProgress } from "../Progress";

export default function AssessmentComponent() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState("");

  const navigate = useNavigate();

  // ⭐ FIXED PREMIUM CHECK ⭐
  const user = JSON.parse(localStorage.getItem("user"));
  const isPremium = user?.isPremium === true;

  useEffect(() => {
    if (!isPremium) {
      navigate("/pricing");
    }
  }, [isPremium, navigate]);

  if (!isPremium) {
    return (
      <div className="p-6 bg-red-50 border border-red-300 rounded-xl text-center text-red-700 font-semibold">
        Premium Access Required — Redirecting...
      </div>
    );
  }

  const current = QUESTIONS[step];

  const handleSelect = (score) => {
    setAnswers({ ...answers, [current.id]: score });
  };

  const calculateResult = () => {
    const total = Object.values(answers).reduce((a, b) => a + b, 0);

    let finalResult = "";

    if (total >= 95)
      finalResult = "Science & Technology (Engineering, AI, Research)";
    else if (total >= 75)
      finalResult = "Medical & Healthcare (MBBS, Biotech, Nursing)";
    else if (total >= 55)
      finalResult = "Commerce Fields (Finance, Marketing, Management)";
    else finalResult = "Arts & Humanities (Law, Psychology, Media)";

    setResult(finalResult);

    updateProgress("stage11to12");

    localStorage.setItem(
      "stage11to12Result",
      JSON.stringify({
        score: total,
        finalPath: finalResult,
      })
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border">
      {!result ? (
        <>
          <h3 className="text-xl font-bold mb-4">{current.text}</h3>

          <div className="space-y-3">
            {current.options.map((o, i) => (
              <label
                key={i}
                className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border hover:bg-cyan-50 transition"
              >
                <input
                  type="radio"
                  name={`q${current.id}`}
                  checked={answers[current.id] === o.score}
                  onChange={() => handleSelect(o.score)}
                />
                {o.label}
              </label>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => step > 0 && setStep(step - 1)}
              className="px-5 py-2 bg-black text-white rounded-lg"
            >
              Previous
            </button>

            <button
              onClick={() =>
                step + 1 < QUESTIONS.length
                  ? setStep(step + 1)
                  : calculateResult()
              }
              className="px-5 py-2 bg-cyan-600 text-white rounded-lg"
            >
              {step + 1 === QUESTIONS.length ? "Finish" : "Next"}
            </button>
          </div>
        </>
      ) : (
        <div className="p-6 bg-cyan-50 rounded-xl border text-center">
          <h3 className="text-xl font-bold text-cyan-700 mb-3">
            Your Career Path
          </h3>

          <p className="text-gray-800">{result}</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-black text-white rounded-lg"
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
