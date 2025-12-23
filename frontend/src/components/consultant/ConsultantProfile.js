import React, { useState, useEffect } from "react";
import { FaUsers, FaStar, FaClock, FaCalendar, FaCheckCircle, FaDollarSign } from "react-icons/fa";
import "../../styles/consultant/Profile.css";

export default function ConsultantProfile({ user }) {
    const [stats, setStats] = useState({
        totalBookings: 0,
        completedSessions: 0,
        upcomingSessions: 0,
        averageRating: 0,
        totalEarnings: 0
    });

    useEffect(() => {
        // TODO: Fetch consultant stats from API
        // For now, using placeholder data
    }, []);

    if (!user) {
        return (
            <div className="profile-loading">
                <div className="loading-spinner"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="consultant-profile-container">
            {/* Hero Section */}
            <div className="consultant-hero">
                <div className="hero-content">
                    <h1>Welcome, {user.name || user.fullName}!</h1>
                    <p className="consultant-role">Career Consultant</p>
                </div>
                <div className="verification-badge">
                    {user.isVerified ? (
                        <span className="verified"><FaCheckCircle /> Verified</span>
                    ) : (
                        <span className="pending">Pending Verification</span>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="consultant-stats-grid">
                <div className="stat-card">
                    <div className="stat-icon purple">
                        <FaUsers />
                    </div>
                    <div className="stat-details">
                        <div className="stat-value">{stats.totalBookings}</div>
                        <div className="stat-label">Total Clients</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon green">
                        <FaCheckCircle />
                    </div>
                    <div className="stat-details">
                        <div className="stat-value">{stats.completedSessions}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon blue">
                        <FaCalendar />
                    </div>
                    <div className="stat-details">
                        <div className="stat-value">{stats.upcomingSessions}</div>
                        <div className="stat-label">Upcoming</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon orange">
                        <FaStar />
                    </div>
                    <div className="stat-details">
                        <div className="stat-value">{stats.averageRating.toFixed(1) || "N/A"}</div>
                        <div className="stat-label">Rating</div>
                    </div>
                </div>
            </div>

            {/* Info Grid */}
            <div className="consultant-info-grid">
                {/* Profile Details */}
                <div className="info-card">
                    <h2>Profile Information</h2>
                    <div className="info-list">
                        <div className="info-row">
                            <span className="label">Email</span>
                            <span className="value">{user.email}</span>
                        </div>
                        {user.mobile && (
                            <div className="info-row">
                                <span className="label">Phone</span>
                                <span className="value">{user.mobile}</span>
                            </div>
                        )}
                        {user.specialization && (
                            <div className="info-row">
                                <span className="label">Specialization</span>
                                <span className="value">{user.specialization}</span>
                            </div>
                        )}
                        {user.experience && (
                            <div className="info-row">
                                <span className="label">Experience</span>
                                <span className="value">{user.experience} years</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Availability */}
                <div className="info-card">
                    <h2><FaClock /> Availability</h2>
                    <div className="info-list">
                        {user.availability && user.availability.length > 0 ? (
                            user.availability.map((slot, idx) => (
                                <div key={idx} className="availability-slot">
                                    <span className="day">{slot.day}</span>
                                    <span className="time">{slot.startTime} - {slot.endTime}</span>
                                </div>
                            ))
                        ) : (
                            <p className="no-data">No availability set</p>
                        )}
                    </div>
                </div>

                {/* Pricing */}
                <div className="info-card">
                    <h2><FaDollarSign /> Pricing</h2>
                    <div className="info-list">
                        {user.sessionPrice && (
                            <div className="info-row">
                                <span className="label">Session Rate</span>
                                <span className="price-tag">₹{user.sessionPrice}/session</span>
                            </div>
                        )}
                        <div className="info-row">
                            <span className="label">Total Earnings</span>
                            <span className="earnings">₹{stats.totalEarnings}</span>
                        </div>
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="info-card full-width">
                    <h2>Recent Bookings</h2>
                    <div className="bookings-list">
                        <p className="no-data">No bookings yet</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
