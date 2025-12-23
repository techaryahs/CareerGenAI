import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaPlus, FaUserTie, FaCheckCircle, FaClock, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/student/UpcomingConsultations.css';

const UpcomingConsultations = ({ user }) => {
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [pastBookings, setPastBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPast, setShowPast] = useState(false);
    const navigate = useNavigate();
    const API = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetchBookings();
    }, [user]);

    const fetchBookings = async () => {
        try {
            if (!user?.email) {
                setLoading(false);
                return;
            }

            const res = await axios.get(`${API}/api/bookings/user/${user.email}`);
            if (res.data && Array.isArray(res.data)) {
                const now = new Date();

                const upcoming = res.data
                    .filter(b => new Date(`${b.date} ${b.time}`) >= now)
                    .sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`))
                    .slice(0, 3);

                const past = res.data
                    .filter(b => new Date(`${b.date} ${b.time}`) < now)
                    .sort((a, b) => new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`))
                    .slice(0, 3);

                setUpcomingBookings(upcoming);
                setPastBookings(past);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const displayBookings = showPast ? pastBookings : upcomingBookings;
    const hasAnyBookings = upcomingBookings.length > 0 || pastBookings.length > 0;

    return (
        <div className="consultations-modern card-v3 animate-entrance">
            <div className="section-header-v3" style={{ padding: 'var(--space-lg) var(--space-lg) 0' }}>
                <div className="header-left">
                    <h2 className="section-title-v3">
                        <div className="icon-box-v3">
                            {showPast ? <FaHistory /> : <FaCalendarAlt />}
                        </div>
                        {showPast ? 'Past Sessions' : 'Upcoming'}
                    </h2>
                </div>
                <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
                    <button
                        className={`btn-toggle-past ${showPast ? 'active' : ''}`}
                        onClick={() => setShowPast(!showPast)}
                    >
                        <FaHistory />
                        <span>{showPast ? "Show Upcoming" : "View History"}</span>
                    </button>
                    <button
                        className="btn-book-icon"
                        onClick={() => navigate('/consult')}
                    >
                        <FaPlus />
                    </button>
                </div>
            </div>

            <div style={{ padding: 'var(--space-lg)' }}>
                {loading ? (
                    <div className="loading-shimmer" style={{ height: '100px', borderRadius: 'var(--radius-md)' }}></div>
                ) : hasAnyBookings ? (
                    <>
                        {displayBookings.length > 0 ? (
                            <div className="bookings-list-v3">
                                {displayBookings.map((booking, index) => (
                                    <div key={index} className="booking-card-v3 card-v3">
                                        <div className="consultant-profile-v3">
                                            <div className="avatar-mini-v3">
                                                <FaUserTie />
                                            </div>
                                            <div className="consultant-info-v3">
                                                <h4>{booking.consultantName}</h4>
                                                <p>{booking.consultantEmail}</p>
                                            </div>
                                        </div>

                                        <div className="booking-meta-v3">
                                            <div className="meta-pill-v3">
                                                <FaCalendarAlt />
                                                <span>{formatDate(booking.date)}</span>
                                            </div>
                                            <div className="meta-pill-v3">
                                                <FaClock />
                                                <span>{booking.time}</span>
                                            </div>
                                            <div className={`status-badge-v3 ${booking.status}`}>
                                                {booking.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state-v3">
                                <p>{showPast ? 'Your consultation history is currently empty.' : 'No upcoming sessions scheduled.'}</p>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="empty-state-v3" style={{ textAlign: 'center', padding: 'var(--space-xl) 0' }}>
                        <FaCalendarAlt style={{ fontSize: '48px', color: 'var(--border-main)', marginBottom: 'var(--space-md)' }} />
                        <h3>Accelerate Your Career</h3>
                        <p style={{ color: 'var(--text-sub)', marginBottom: 'var(--space-lg)' }}>Connect with industry experts for personalized guidance.</p>
                        <button className="btn-premium primary" onClick={() => navigate('/consult')}>
                            <FaPlus /> Book First Session Free
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpcomingConsultations;
