import React, { useEffect, useState } from 'react';
import { FaChartLine, FaFire, FaHistory } from 'react-icons/fa';
import axios from 'axios';
import '../../styles/student/ActivityHeatmap.css';

const ActivityHeatmap = ({ user }) => {
    const [activityDays, setActivityDays] = useState({});
    const [loading, setLoading] = useState(true);

    const cleanAPI = React.useMemo(() => {
        const rawAPI = process.env.REACT_APP_API_URL || "http://localhost:5001";
        return rawAPI.endsWith("/") ? rawAPI.slice(0, -1) : rawAPI;
    }, []);

    useEffect(() => {
        fetchActivityData();
    }, [user, cleanAPI]);

    const fetchActivityData = async () => {
        const dayMap = {};
        if (!user?._id) return;

        try {
            // 1. Account Creation
            if (user?.createdAt) {
                const dateKey = new Date(user.createdAt).toISOString().split('T')[0];
                dayMap[dateKey] = (dayMap[dateKey] || 0) + 1;
            }

            // 2. Legacy Quiz Data
            if (user?.services?.quiz?.lastAttemptAt) {
                const dateKey = new Date(user.services.quiz.lastAttemptAt).toISOString().split('T')[0];
                dayMap[dateKey] = (dayMap[dateKey] || 0) + 1;
            }

            // 3. Bookings
            if (user?.email) {
                try {
                    const res = await axios.get(`${cleanAPI}/api/bookings/user/${user.email}`);
                    if (res.data && Array.isArray(res.data)) {
                        res.data.forEach(booking => {
                            const date = new Date(booking.createdAt || booking.date);
                            const dateKey = date.toISOString().split('T')[0];
                            dayMap[dateKey] = (dayMap[dateKey] || 0) + 1;
                        });
                    }
                } catch (err) { }
            }

            // 4. Live Progress Report (Growth Pulse)
            try {
                const res = await axios.get(`${cleanAPI}/api/progress/get-progress/${user._id}`);
                if (res.data?.success && res.data.data) {
                    const report = res.data.data;

                    // Partial progress updates
                    if (report.stageProgress) {
                        Object.values(report.stageProgress).forEach(prog => {
                            if (prog.lastUpdated) {
                                const dateKey = new Date(prog.lastUpdated).toISOString().split('T')[0];
                                dayMap[dateKey] = (dayMap[dateKey] || 0) + 1;
                            }
                        });
                    }

                    // Final results updates
                    if (report.stageResults) {
                        Object.values(report.stageResults).forEach(stageRes => {
                            // If results don't have a specific date, use the report's updatedAt as fallback for activity presence
                            const dateKey = new Date(report.updatedAt).toISOString().split('T')[0];
                            dayMap[dateKey] = (dayMap[dateKey] || 0) + 1;
                        });
                    }
                }
            } catch (err) { }

            setActivityDays(dayMap);
        } catch (error) {
            console.error("Heatmap fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const generateActivityCalendar = () => {
        const weeks = [];
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 83);
        const dayOfWeek = startDate.getDay();
        startDate.setDate(startDate.getDate() - dayOfWeek);

        for (let week = 0; week < 12; week++) {
            const weekDays = [];
            for (let day = 0; day < 7; day++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + (week * 7) + day);
                const dateKey = currentDate.toISOString().split('T')[0];
                const count = activityDays[dateKey] || 0;
                weekDays.push({
                    date: dateKey,
                    count: count,
                    level: count === 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : count === 3 ? 3 : 4
                });
            }
            weeks.push(weekDays);
        }
        return weeks;
    };

    const activityCalendar = generateActivityCalendar();
    const totalActivities = Object.values(activityDays).reduce((sum, count) => sum + count, 0);
    const activeDays = Object.keys(activityDays).length;

    return (
        <div className="activity-heatmap-v3 card-v3 animate-entrance heatmap-card-v3">
            <div className="heatmap-header-v3">
                <h2 className="section-title-v3">
                    <div className="icon-box-v3">
                        <FaChartLine />
                    </div>
                    Growth Pulse
                </h2>
                <div className="heatmap-stats-v3">
                    <div className="h-stat-v3">
                        <FaFire />
                        <span>{activeDays} Active Days</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="shimmer-container" style={{ height: '120px', borderRadius: 'var(--radius-md)', background: 'var(--bg-main)' }}></div>
            ) : (
                <>
                    <div className="heatmap-grid-wrapper-v3">
                        <div className="heatmap-months-v3">
                            {['3 Months Ago', '2 Months Ago', '1 Month Ago', 'Active'].map((month, i) => (
                                <span key={i}>{month}</span>
                            ))}
                        </div>

                        <div className="heatmap-grid-v3">
                            <div className="heatmap-labels-v3">
                                <span>Sun</span>
                                <span>Tue</span>
                                <span>Thu</span>
                                <span>Sat</span>
                            </div>
                            <div className="heatmap-weeks-v3">
                                {activityCalendar.map((week, weekIndex) => (
                                    <div key={weekIndex} className="heatmap-week-v3">
                                        {week.map((day, dayIndex) => (
                                            <div
                                                key={dayIndex}
                                                className={`heatmap-day-v3 level-${day.level}`}
                                                title={`${day.date}: ${day.count} events`}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="heatmap-footer-v3">
                        <div className="heatmap-legend-v3">
                            <span>Quiet</span>
                            <div className="legend-box-v3 level-0"></div>
                            <div className="legend-box-v3 level-1"></div>
                            <div className="legend-box-v3 level-2"></div>
                            <div className="legend-box-v3 level-3"></div>
                            <div className="legend-box-v3 level-4"></div>
                            <span>Active</span>
                        </div>
                        <div className="heatmap-total" style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-sub)' }}>
                            <strong>{totalActivities}</strong> Developmental Milestones
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ActivityHeatmap;
