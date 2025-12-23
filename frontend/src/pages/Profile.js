// src/pages/Profile.js
import React, { useEffect, useState } from "react";
import "../styles/Profile.css";
import axios from "axios";
import PageLoader from "../components/PageLoader";
import ParentRegisterModal from "../components/ParentRegisterModal";

// Import role-specific profile components
import StudentProfile from "../components/student/StudentProfile";
import ConsultantProfile from "../components/consultant/ConsultantProfile";
import TeacherProfile from "../components/teacher/TeacherProfile";
import ParentProfile from "../components/parent/ParentProfile";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [showParentModal, setShowParentModal] = useState(false);
  const [role, setRole] = useState(null);

  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedRole = localStorage.getItem("role");

    setUser(storedUser);
    setRole(storedRole);

    // ✅ Fetch fresh data from DB to ensure createdAt is present
    const fetchFreshUser = async () => {
      if (storedUser?.email) {
        try {
          const res = await axios.get(`${API}/api/user/${storedUser.email}`);
          if (res.data) {
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
          }
        } catch (err) {
          console.error("Fresh user fetch error:", err);
        }
      }
    };

    fetchFreshUser();

    const timer = setTimeout(() => setPageLoading(false), 1200);

    const handleOpenParentModal = () => setShowParentModal(true);
    window.addEventListener('openParentModal', handleOpenParentModal);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('openParentModal', handleOpenParentModal);
    };
  }, []);

  const handleProfileUpdate = async (updates) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      const res = await axios.post(`${API}/api/user/update-profile`, {
        userId: storedUser._id || storedUser.id,
        ...updates
      });

      if (res.data.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error("Profile update error:", err.response?.data || err.message);
      alert("❌ Failed to update profile");
    }
  };

  if (pageLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <div className="profile-wrapper">
        {role === "student" && (
          <StudentProfile user={user} onProfileUpdate={handleProfileUpdate} />
        )}
        {role === "consultant" && (
          <ConsultantProfile user={user} />
        )}
        {role === "teacher" && (
          <TeacherProfile user={user} onProfileUpdate={handleProfileUpdate} />
        )}
        {role === "parent" && (
          <ParentProfile user={user} onProfileUpdate={handleProfileUpdate} />
        )}
        {!role && (
          <div className="no-role-message">
            <p>Please log in to view your profile</p>
          </div>
        )}
      </div>

      {showParentModal && (
        <ParentRegisterModal
          onClose={() => setShowParentModal(false)}
          studentId={user?._id || user?.id}
        />
      )}
    </>
  );
};

export default Profile;
