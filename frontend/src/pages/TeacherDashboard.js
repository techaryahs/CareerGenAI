import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaGraduationCap,
    FaBookOpen,
    FaClock,
    FaChartLine,
    FaDollarSign,
    FaMapMarkerAlt,
    FaCheckCircle,
    FaHourglassHalf,
    FaUsers,
    FaStar,
} from "react-icons/fa";
import "../styles/teacher/Dashboard.css";

export default function TeacherDashboard() {
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        const role = localStorage.getItem("role");

        if (!userData || role !== "teacher") {
            navigate("/login");
            return;
        }

        try {
            const parsedUser = JSON.parse(userData);
            setTeacher(parsedUser);
        } catch (error) {
            console.error("Error parsing user data:", error);
            navigate("/login");
        }
    }, [navigate]);

    if (!teacher) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="teacher-dashboard-modern">
            {/* Hero Section */}
            <div className="dashboard-hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Welcome back, {teacher.name || teacher.fullName}! 👋
                    </h1>
                    <p className="hero-subtitle">
                        Manage your teaching profile and track your impact
                    </p>
                </div>
                <div className="hero-badge">
                    {teacher.isVerified ? (
                        <div className="status-badge verified">
                            <FaCheckCircle /> Verified Teacher
                        </div>
                    ) : (
                        <div className="status-badge pending">
                            <FaHourglassHalf /> Pending Verification
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="stats-overview">
                <div className="stat-card">
                    <div className="stat-icon purple">
                        <FaBookOpen />
                    </div>
                    <div className="stat-details">
                        <div className="stat-value">{teacher.selectedSubjects?.length || 0}</div>
                        <div className="stat-label">Subjects</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon blue">
                        <FaClock />
                    </div>
                    <div className="stat-details">
                        <div className="stat-value">{teacher.slots?.length || 0}</div>
                        <div className="stat-label">Time Slots</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon green">
                        <FaUsers />
                    </div>
                    <div className="stat-details">
                        <div className="stat-value">0</div>
                        <div className="stat-label">Students</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon orange">
                        <FaStar />
                    </div>
                    <div className="stat-details">
                        <div className="stat-value">{teacher.experienceYears || 0}</div>
                        <div className="stat-label">Years Exp.</div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="content-grid">
                {/* Profile Card */}
                <div className="info-card">
                    <div className="card-header">
                        <FaGraduationCap className="header-icon" />
                        <h2>Profile Information</h2>
                    </div>
                    <div className="card-body">
                        <div className="info-row">
                            <span className="info-label">Email</span>
                            <span className="info-value">{teacher.email}</span>
                        </div>
                        {teacher.phone && (
                            <div className="info-row">
                                <span className="info-label">Phone</span>
                                <span className="info-value">{teacher.phone}</span>
                            </div>
                        )}
                        {teacher.bio && (
                            <div className="info-row">
                                <span className="info-label">Bio</span>
                                <span className="info-value">{teacher.bio}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Teaching Details */}
                <div className="info-card">
                    <div className="card-header">
                        <FaChartLine className="header-icon" />
                        <h2>Teaching Details</h2>
                    </div>
                    <div className="card-body">
                        {teacher.teachingMode && (
                            <div className="info-row">
                                <span className="info-label">Mode</span>
                                <span className="mode-badge">
                                    {teacher.teachingMode.toUpperCase()}
                                </span>
                            </div>
                        )}
                        {teacher.onlinePrice && (
                            <div className="info-row">
                                <span className="info-label">
                                    <FaDollarSign /> Online Rate
                                </span>
                                <span className="price-tag">₹{teacher.onlinePrice}/hr</span>
                            </div>
                        )}
                        {teacher.offlinePrice && (
                            <div className="info-row">
                                <span className="info-label">
                                    <FaDollarSign /> Offline Rate
                                </span>
                                <span className="price-tag">₹{teacher.offlinePrice}/hr</span>
                            </div>
                        )}
                        {teacher.offlineLocation && (
                            <div className="info-row">
                                <span className="info-label">
                                    <FaMapMarkerAlt /> Location
                                </span>
                                <span className="info-value">{teacher.offlineLocation}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Subjects */}
                {teacher.selectedSubjects && teacher.selectedSubjects.length > 0 && (
                    <div className="info-card full-width">
                        <div className="card-header">
                            <FaBookOpen className="header-icon" />
                            <h2>Your Subjects</h2>
                        </div>
                        <div className="card-body">
                            <div className="subjects-grid">
                                {teacher.selectedSubjects.map((subject, index) => (
                                    <div key={index} className="subject-chip">
                                        {subject}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Availability */}
                {teacher.slots && teacher.slots.length > 0 && (
                    <div className="info-card full-width">
                        <div className="card-header">
                            <FaClock className="header-icon" />
                            <h2>Availability Schedule</h2>
                        </div>
                        <div className="card-body">
                            <div className="slots-grid">
                                {teacher.slots.map((slot, index) => (
                                    <div key={index} className="slot-card">
                                        <div className="slot-day">{slot.day}</div>
                                        {slot.startTime && slot.endTime && (
                                            <div className="slot-time">
                                                {slot.startTime} - {slot.endTime}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
