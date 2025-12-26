import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaChalkboardTeacher } from 'react-icons/fa';
import '../styles/TeacherSearch.css';

const TeacherSearch = () => {
    const [query, setQuery] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const API = process.env.REACT_APP_API_URL;

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const res = await axios.get(`${API}/api/bookings/search-teachers`, {
                params: { query }
            });
            setTeachers(res.data.teachers || []);
        } catch (err) {
            console.error("Search error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Initial search for all verified teachers if needed, or keep it empty
    useEffect(() => {
        // Optional: pre-load some teachers
    }, []);

    return (
        <div className="teacher-search-container">
            <div className="search-hero">
                <h1>Find Your Perfect Teacher</h1>
                <p>Search by subject, name, or expertise to book your next class.</p>

                <form className="search-bar-wrapper" onSubmit={handleSearch}>
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search for 'Maths', 'Physics', or a teacher's name..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>
            </div>

            <div className="teachers-grid">
                {loading ? (
                    <div className="search-loader">Searching for experts...</div>
                ) : teachers.length > 0 ? (
                    teachers.map((teacher) => (
                        <div key={teacher._id} className="teacher-search-card">
                            <div className="teacher-card-badge">Verified</div>
                            <div className="teacher-card-main">
                                <div className="teacher-avatar">
                                    {teacher.fullName.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="teacher-info">
                                    <h3>{teacher.fullName}</h3>
                                    <p className="teacher-exp">{teacher.experienceYears} Years Experience</p>
                                    <div className="teacher-subjects">
                                        {teacher.selectedSubjects.map((sub, i) => (
                                            <span key={i} className="subject-tag">{sub}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="teacher-card-details">
                                <div className="detail-item">
                                    <FaChalkboardTeacher />
                                    <span>{teacher.teachingMode.toUpperCase()}</span>
                                </div>
                                {teacher.offlineLocation && (
                                    <div className="detail-item">
                                        <FaMapMarkerAlt />
                                        <span>{teacher.offlineLocation}</span>
                                    </div>
                                )}
                            </div>

                            <div className="teacher-card-footer">
                                <div className="pricing">
                                    {teacher.onlinePrice && <span>₹{teacher.onlinePrice}/hr (Online)</span>}
                                    {teacher.offlinePrice && <span>₹{teacher.offlinePrice}/hr (Offline)</span>}
                                </div>
                                <button
                                    className="book-now-btn"
                                    onClick={() => navigate(`/book-teacher/${teacher._id}`, { state: { teacher } })}
                                >
                                    Book Class
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    query && !loading && <div className="no-results">No teachers found for "{query}". Try another subject!</div>
                )}
            </div>
        </div>
    );
};

export default TeacherSearch;
