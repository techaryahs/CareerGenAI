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
import axios from "axios";

export default function TeacherDashboard() {
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState(null);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const userData = localStorage.getItem("user");
            const role = localStorage.getItem("role");
            const token = localStorage.getItem("token");

            if (!userData || role !== "teacher" || !token) {
                navigate("/login");
                return;
            }

            try {
                const userObj = JSON.parse(userData);

                // 1. Fetch Fresh Teacher Profile from DB
                const profileRes = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/teacher/${userObj._id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setTeacher(profileRes.data);

                // 2. Fetch Bookings
                fetchBookings(userObj._id);

            } catch (err) {
                console.error("Dashboard Load Error:", err);
                if (err.response?.status === 401 || err.response?.status === 404) {
                    navigate("/login");
                }
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const fetchBookings = async (teacherId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/bookings/teacher-bookings/${teacherId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Handle both array and object response formats
            const bookingsData = Array.isArray(res.data) ? res.data : (res.data.bookings || []);
            setBookings(bookingsData);
        } catch (err) {
            console.error("Error fetching bookings:", err);
            setBookings([]);
        }
    };

    console.log("TeacherDashboard Render:", { teacher, bookings });

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
                        <div className="stat-value">
                            {[...new Set(bookings.map(b => b.userEmail))].length}
                        </div>
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
                        <div className="header-left">
                            <FaGraduationCap className="header-icon" />
                            <h2>Profile Information</h2>
                        </div>
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
                        <div className="header-left">
                            <FaChartLine className="header-icon" />
                            <h2>Teaching Details</h2>
                        </div>
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
                <div className="info-card full-width">
                    <div className="card-header">
                        <div className="header-left">
                            <FaBookOpen className="card-icon" />
                            <h3>Subject Expertise</h3>
                        </div>
                    </div>
                    <div className="subjects-container">
                        <div className="subjects-list">
                            {(teacher.selectedSubjects || []).map((subject, index) => (
                                <span key={index} className="subject-tag">
                                    {subject}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Upcoming Appointments */}
                <div className="info-card full-width">
                    <div className="card-header">
                        <div className="header-left">
                            <FaClock className="header-icon" />
                            <h2>Upcoming Class Appointments</h2>
                        </div>
                    </div>
                    <div className="card-body">
                        {bookings.length > 0 ? (
                            <div className="appointments-table-wrapper">
                                <table className="appointments-table">
                                    <thead>
                                        <tr>
                                            <th>Student Name</th>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Mode</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.map((booking) => (
                                            <tr key={booking._id}>
                                                <td>
                                                    <div className="student-name-cell">
                                                        <span className="student-initials">
                                                            {(booking.userName || "U").substring(0, 1).toUpperCase()}
                                                        </span>
                                                        {booking.userName}
                                                    </div>
                                                </td>
                                                <td>{booking.date}</td>
                                                <td>{booking.time}</td>
                                                <td>
                                                    <span className={`mode-badge-small ${booking.classMode}`}>
                                                        {booking.classMode}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`status-pill ${booking.status}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="no-bookings">
                                <p>No appointments booked yet. Your students' scheduled classes will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
