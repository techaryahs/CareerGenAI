import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaCalendarCheck,
  FaHourglassHalf,
  FaCheckCircle,
  FaVideo,
  FaClock,
  FaEnvelope,
  FaChartLine,
  FaTimesCircle
} from "react-icons/fa";
import "../styles/ConsultantDashboard.css";

const ConsultantDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const consultant = JSON.parse(localStorage.getItem("user"));
  const consultantId = consultant?.id;

  useEffect(() => {
    // Check if user is actually a consultant
    const userRole = localStorage.getItem('role');
    if (userRole !== 'consultant') {
      console.log('Not a consultant, redirecting to home');
      window.location.href = "/";
      return;
    }

    if (!consultantId) {
      window.location.href = "/login";
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/bookings/consultant/${consultantId}`);
        setBookings(res.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [consultantId]);

  const bookingSummary = useMemo(() => {
    const pendingCount = bookings.filter(b => b.status === "pending").length;
    const acceptedCount = bookings.filter(b => b.status === "accepted").length;
    const rejectedCount = bookings.filter(b => b.status === "rejected").length;
    const totalBookings = bookings.length;

    const today = new Date();
    const upcoming = bookings
      .filter(b => b.status === "accepted" && new Date(b.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return { totalBookings, pendingCount, acceptedCount, rejectedCount, upcoming };
  }, [bookings]);

  const updateBookingStatus = async (id, action) => {
    try {
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/bookings/${id}/${action}`);
      setBookings(prev => prev.map(b => (b._id === id ? { ...b, status: res.data.booking.status } : b)));
    } catch (err) {
      console.error("Error updating booking:", err.message);
      alert("Failed to update booking");
    }
  };

  if (loading) {
    return (
      <div className="loading-container-modern">
        <div className="spinner-modern"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="consultant-dashboard-modern">
      <div className="dashboard-max-width">

        {/* Modern Header with Gradient */}
        <div className="dashboard-header-modern">
          <div className="header-content-modern">
            <div>
              <h1 className="dashboard-title-modern">
                <FaChartLine className="title-icon" />
                Consultant Dashboard
              </h1>
              <p className="dashboard-subtitle-modern">
                Welcome back, {consultant?.name || "Consultant"}! Manage your appointments and sessions.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid-modern">
          <div className="stat-card-modern total">
            <div className="stat-icon-wrapper">
              <FaCalendarCheck />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Bookings</span>
              <span className="stat-value">{bookingSummary.totalBookings}</span>
            </div>
          </div>

          <div className="stat-card-modern pending">
            <div className="stat-icon-wrapper">
              <FaHourglassHalf />
            </div>
            <div className="stat-content">
              <span className="stat-label">Pending</span>
              <span className="stat-value">{bookingSummary.pendingCount}</span>
            </div>
          </div>

          <div className="stat-card-modern accepted">
            <div className="stat-icon-wrapper">
              <FaCheckCircle />
            </div>
            <div className="stat-content">
              <span className="stat-label">Accepted</span>
              <span className="stat-value">{bookingSummary.acceptedCount}</span>
            </div>
          </div>

          <div className="stat-card-modern rejected">
            <div className="stat-icon-wrapper">
              <FaTimesCircle />
            </div>
            <div className="stat-content">
              <span className="stat-label">Rejected</span>
              <span className="stat-value">{bookingSummary.rejectedCount}</span>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="section-modern">
          <h2 className="section-title-modern">
            <FaClock /> Upcoming Appointments
          </h2>
          {bookingSummary.upcoming.length > 0 ? (
            <div className="upcoming-grid-modern">
              {bookingSummary.upcoming.slice(0, 4).map((booking) => (
                <div key={booking._id} className="upcoming-card-modern">
                  <div className="upcoming-date-badge">
                    {new Date(booking.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="upcoming-info">
                    <div className="upcoming-user">
                      <FaEnvelope className="info-icon" />
                      <span>{booking.userEmail}</span>
                    </div>
                    <div className="upcoming-time">
                      <FaClock className="info-icon" />
                      <span>{booking.time}</span>
                    </div>
                  </div>
                  <button
                    className="join-upcoming-btn"
                    onClick={() => navigate(`/video-call/${booking._id}`, { state: { booking } })}
                  >
                    <FaVideo /> Join Call
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-modern">
              <FaClock className="empty-icon" />
              <h3>No Upcoming Appointments</h3>
              <p>You don't have any scheduled appointments</p>
            </div>
          )}
        </div>

        {/* All Bookings */}
        <div className="section-modern">
          <h2 className="section-title-modern">
            <FaCalendarCheck /> All Bookings
          </h2>
          {bookings.length > 0 ? (
            <div className="bookings-grid-modern">
              {bookings.map((booking) => {
                const bookingDateTime = new Date(`${booking.date} ${booking.time}`);
                const now = new Date();
                const isFutureOrCurrent = bookingDateTime >= now;
                const isAccepted = booking.status === "accepted";

                return (
                  <div key={booking._id} className="booking-card-modern">
                    <div className="booking-card-header">
                      <div className="booking-date-info">
                        <span className="booking-date">
                          {new Date(booking.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="booking-time">
                          <FaClock /> {booking.time}
                        </span>
                      </div>
                      <span className={`status-badge-modern ${booking.status}`}>
                        {booking.status === "pending" && "⏳ Pending"}
                        {booking.status === "accepted" && "✓ Accepted"}
                        {booking.status === "rejected" && "✗ Rejected"}
                      </span>
                    </div>

                    <div className="booking-card-body">
                      <div className="booking-user-info">
                        <FaEnvelope className="user-icon" />
                        <span>{booking.userEmail}</span>
                      </div>

                      <div className="booking-actions">
                        {booking.status === "pending" && (
                          <div className="action-buttons-group">
                            <button
                              className="action-btn accept"
                              onClick={() => updateBookingStatus(booking._id, "accept")}
                            >
                              <FaCheckCircle /> Accept
                            </button>
                            <button
                              className="action-btn reject"
                              onClick={() => updateBookingStatus(booking._id, "reject")}
                            >
                              <FaTimesCircle /> Reject
                            </button>
                          </div>
                        )}

                        {isAccepted && isFutureOrCurrent && (
                          <button
                            className="action-btn video-call"
                            onClick={() => navigate(`/video-call/${booking._id}`, { state: { booking } })}
                          >
                            <FaVideo /> Join Video Call
                          </button>
                        )}

                        {isAccepted && !isFutureOrCurrent && (
                          <span className="session-ended">
                            <FaCheckCircle /> Session Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state-modern">
              <FaCalendarCheck className="empty-icon" />
              <h3>No Bookings Yet</h3>
              <p>You haven't received any booking requests</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultantDashboard;