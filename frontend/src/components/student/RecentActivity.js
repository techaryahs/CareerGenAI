import React, { useEffect, useState } from 'react';
import { FaClock, FaCalendar, FaTrophy, FaHistory, FaRocket, FaEdit, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import '../../styles/student/RecentActivity.css';

const RecentActivity = ({ user }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const API = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetchRecentActivity();
    }, [user]);

    const fetchRecentActivity = async () => {
        const activityList = [];
        try {
            if (user?.createdAt) {
                activityList.push({
                    type: 'account',
                    title: 'Joined CareerGenAI',
                    timestamp: new Date(user.createdAt),
                    icon: <FaRocket />
                });
            }

            if (user?.services?.quiz?.lastAttemptAt) {
                activityList.push({
                    type: 'quiz',
                    title: `Achieved ${user.services.quiz.bestScore}% Readiness Score`,
                    timestamp: new Date(user.services.quiz.lastAttemptAt),
                    icon: <FaTrophy />
                });
            }

            if (user?.email) {
                try {
                    const res = await axios.get(`${API}/api/bookings/user/${user.email}`);
                    if (res.data && Array.isArray(res.data)) {
                        res.data.slice(0, 3).forEach(booking => {
                            activityList.push({
                                type: 'booking',
                                title: `Masterclass with ${booking.consultantName}`,
                                timestamp: new Date(booking.createdAt || booking.date),
                                icon: <FaCheckCircle />
                            });
                        });
                    }
                } catch (err) { }
            }

            activityList.sort((a, b) => b.timestamp - a.timestamp);
            setActivities(activityList.slice(0, 5));
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const formatTimestamp = (date) => {
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Just moments ago';
        if (diffDays === 1) return 'Yesterday';
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="recent-activity-v3 card-v3 animate-entrance" style={{ padding: 'var(--space-lg)' }}>
            <div className="section-header-v3">
                <h2 className="section-title-v3">
                    <div className="icon-box-v3">
                        <FaHistory />
                    </div>
                    Recent Pulse
                </h2>
            </div>

            <div className="timeline-container-v3" style={{ marginTop: 'var(--space-lg)' }}>
                {loading ? (
                    <div className="shimmer-line" style={{ height: '200px' }}></div>
                ) : activities.length > 0 ? (
                    <div className="timeline-v3">
                        {activities.map((activity, index) => (
                            <div key={index} className="timeline-item-v3">
                                <div className="timeline-marker-v3">
                                    {activity.icon}
                                </div>
                                <div className="timeline-content-v3">
                                    <h4>{activity.title}</h4>
                                    <span className="timeline-time-v3">{formatTimestamp(activity.timestamp)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-sub)', textAlign: 'center' }}>Your activity pulse will appear here as you grow.</p>
                )}
            </div>
        </div>
    );
};

export default RecentActivity;
