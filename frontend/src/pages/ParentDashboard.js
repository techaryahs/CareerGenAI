import { useEffect, useState } from "react";
import axios from "axios";

/* =========================
   SMALL UI BADGE
========================= */
const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 border border-blue-100">
    {children}
  </span>
);

/* =========================
   PARENT DASHBOARD
========================= */
export default function ParentDashboard() {
  const API = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");

  const [student, setStudent] = useState(null);
  const [services, setServices] = useState({});
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH DASHBOARD DATA
  ========================= */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          `${API}/api/parent/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStudent(res.data.profile);
        setServices(res.data.services || {});
      } catch (err) {
        console.error(
          "Parent dashboard fetch error:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [API, token]);

  /* =========================
     STATES
  ========================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading student data...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        ❌ No linked student found
      </div>
    );
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-slate-50 to-slate-100">

      {/* HEADER */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <p className="text-xs uppercase tracking-widest text-blue-500">
            Parent Dashboard
          </p>
          <h1 className="text-xl font-semibold text-gray-800">
            Student Progress Overview
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* STUDENT PROFILE */}
        <section className="bg-white rounded-2xl shadow border p-6">
          <h2 className="text-lg font-semibold text-blue-700 mb-4">
            Student Details
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xl font-semibold">{student.name}</p>
              <p className="text-sm text-gray-600">{student.email}</p>
              {student.mobile && (
                <p className="text-sm text-gray-600">{student.mobile}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge>Linked Student</Badge>
              <Badge>Career Guidance</Badge>
              {student.isPremium && <Badge>Premium</Badge>}
            </div>
          </div>
        </section>

        {/* SERVICE PROGRESS */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          <ServiceCard
            title="Career Quiz"
            active={services.quiz?.attempted}
            info={`Attempts: ${services.quiz?.totalAttempts || 0}`}
            extra={`Best Score: ${services.quiz?.bestScore || 0}`}
          />

          <ServiceCard
            title="Career Roadmap"
            active={services.careerRoadmap?.started}
            info={`Progress: ${services.careerRoadmap?.progressPercent || 0}%`}
            extra={`Stage: ${services.careerRoadmap?.currentStage || "—"}`}
          />

          <ServiceCard
            title="Skill Learning"
            active={services.skillLearningPaths?.skillsCompleted?.length > 0}
            info={`Completed: ${
              services.skillLearningPaths?.skillsCompleted?.length || 0
            }`}
            extra={`In Progress: ${
              services.skillLearningPaths?.skillsInProgress?.length || 0
            }`}
          />

          <ServiceCard
            title="AI Career Recommendation"
            active={services.aiCareerRecommendation?.generated}
            info={`Careers: ${
              services.aiCareerRecommendation?.recommendedCareers?.length || 0
            }`}
            extra={`Confidence: ${
              services.aiCareerRecommendation?.confidenceScore || "—"
            }`}
          />

          <ServiceCard
            title="Resume Builder"
            active={services.resumeBuilder?.created}
            info={`Resumes: ${services.resumeBuilder?.resumeCount || 0}`}
            extra={`Last: ${
              services.resumeBuilder?.lastResumeTitle || "—"
            }`}
          />

          <ServiceCard
            title="Mock Interviews"
            active={services.mockInterviews?.attempted}
            info={`Attempts: ${services.mockInterviews?.totalAttempts || 0}`}
            extra={`Avg Score: ${
              services.mockInterviews?.averageScore || "—"
            }`}
          />

        </section>
      </main>
    </div>
  );
}

/* =========================
   SERVICE CARD
========================= */
function ServiceCard({ title, active, info, extra }) {
  return (
    <div className="bg-white rounded-xl shadow border p-5 hover:shadow-md transition">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <span
          className={`text-xs px-3 py-1 rounded-full ${
            active
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {active ? "Active" : "Not Used"}
        </span>
      </div>

      <p className="text-sm text-gray-600">{info}</p>
      <p className="text-xs text-gray-500 mt-1">{extra}</p>
    </div>
  );
}
