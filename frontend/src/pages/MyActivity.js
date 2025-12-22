import React, { useEffect, useState } from "react";
import axios from "axios";
import PageLoader from "../components/PageLoader";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaLock,
  FaCrown
} from "react-icons/fa";

const MyActivity = () => {
  const [user, setUser] = useState(null);
  const [services, setServices] = useState({});
  const [loading, setLoading] = useState(true);

  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      setLoading(false);
      return;
    }

    setUser(storedUser);

    const fetchActivity = async () => {
      try {
        const res = await axios.get(
          `${API}/api/profile/${storedUser._id || storedUser.id}`
        );
        setServices(res.data.services || {});
      } catch (err) {
        console.error("MyActivity fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [API]);

  if (loading) return <PageLoader />;
  if (!user) return <p className="text-center mt-10">No user found</p>;

  /* =========================
     STATUS BADGE
  ========================= */
  const StatusBadge = ({ active, premium }) => {
    if (premium && !user.isPremium) {
      return (
        <span className="flex items-center gap-2 text-xs font-medium text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
          <FaLock /> Premium
        </span>
      );
    }

    if (active) {
      return (
        <span className="flex items-center gap-2 text-xs font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
          <FaCheckCircle /> Completed
        </span>
      );
    }

    return (
      <span className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
        <FaTimesCircle /> Not Used
      </span>
    );
  };

  /* =========================
     ACTIVITY CARD
  ========================= */
  const ActivityCard = ({ title, description, active, info, premium }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <StatusBadge active={active} premium={premium} />
      </div>

      <p className="text-sm text-gray-600 mb-2">{description}</p>

      <p className="text-sm font-medium text-gray-800">
        {info || "No activity yet"}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-gray-800">📊 My Activity</h1>
        <p className="text-gray-600 mt-1">
          Track your usage, progress, and service status
        </p>
      </div>

      {/* ACTIVITY GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <ActivityCard
          title="Career Roadmap"
          description="Your personalized career journey"
          active={services.careerRoadmap?.started}
          info={`Progress: ${services.careerRoadmap?.progressPercent || 0}%`}
        />

        <ActivityCard
          title="Skill Learning Paths"
          description="Skills you are currently learning"
          active={services.skillLearningPaths?.skillsCompleted?.length > 0}
          info={`Skills Completed: ${
            services.skillLearningPaths?.skillsCompleted?.length || 0
          }`}
        />

        <ActivityCard
          title="AI Career Recommendation"
          description="Careers suggested by AI"
          active={services.aiCareerRecommendation?.generated}
          info={
            services.aiCareerRecommendation?.recommendedCareers?.join(", ") ||
            "No recommendations yet"
          }
        />

        <ActivityCard
          title="Resume Builder"
          description="AI-powered resume creation"
          active={services.resumeBuilder?.created}
          info={`Resumes Created: ${services.resumeBuilder?.resumeCount || 0}`}
          premium
        />

        <ActivityCard
          title="Mock Interviews"
          description="Practice interviews with AI"
          active={services.mockInterviews?.attempted}
          info={`Attempts: ${services.mockInterviews?.totalAttempts || 0}`}
          premium
        />

        <ActivityCard
          title="PDF Downloads"
          description="Downloaded study resources"
          active={services.pdfDownloads?.totalDownloads > 0}
          info={`Downloads: ${services.pdfDownloads?.totalDownloads || 0}`}
        />

        <ActivityCard
          title="College Recommendations"
          description="Colleges matched to your profile"
          active={services.collegeRecommendations?.searched}
          info={`Colleges Suggested: ${
            services.collegeRecommendations?.recommendedColleges?.length || 0
          }`}
        />

      </div>

      {/* PREMIUM CTA */}
      {!user.isPremium && (
        <div className="max-w-4xl mx-auto mt-12 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <FaCrown /> Upgrade to Premium
            </h2>
            <p className="text-sm mt-2 opacity-90">
              Unlock Resume Builder, Mock Interviews & advanced insights
            </p>
          </div>
          <button className="bg-white text-orange-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition">
            Upgrade Now
          </button>
        </div>
      )}

    </div>
  );
};

export default MyActivity;
