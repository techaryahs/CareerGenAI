import React from 'react';
import { FaCheckCircle, FaMapMarkerAlt, FaEnvelope, FaPhone, FaCalendarAlt, FaEdit } from 'react-icons/fa';
import '../../styles/student/ProfileHeader.css';

const TeacherHeader = ({ teacher, onEditRequest }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'Member';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const getInitials = (name) => {
        if (!name) return 'T';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="profile-header animate-entrance">
            <div className="profile-banner">
                <div className="banner-overlay" />
            </div>

            <div className="profile-header-content">
                <div className="profile-header-left">
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar-container">
                            <div className="avatar-initials">
                                {getInitials(teacher?.fullName || teacher?.name)}
                            </div>
                        </div>
                    </div>

                    <div className="profile-header-info">
                        <div className="name-badge-grid">
                            <h1 className="profile-name">
                                {teacher?.fullName || teacher?.name || 'Expert Educator'}
                            </h1>
                            {/* ✅ Exact match with student ProfileHeader badge logic */}
                            {teacher?.isVerified && <FaCheckCircle className="badge-verified" title="Verified Expert" />}
                            <span className="badge-pioneer">Teacher</span>
                        </div>
                        <p className="profile-handle">@{teacher?.teachingField?.fieldName || 'Mentorship Lead'}</p>

                        <p className="profile-bio">
                            {teacher?.bio || "Empowering students through personalized guidance and industrial insights."}
                        </p>

                        <div className="profile-meta-row">
                            <div className="meta-item">
                                <FaMapMarkerAlt />
                                <span>{teacher?.offlineLocation || teacher?.location || 'Global'}</span>
                            </div>
                            <div className="meta-item">
                                <FaCalendarAlt />
                                <span>Joined {formatDate(teacher?.createdAt)}</span>
                            </div>
                            <div className="meta-item">
                                <FaEnvelope />
                                <span style={{ fontSize: '11px' }}>{teacher?.email}</span>
                            </div>
                            {teacher?.phone && (
                                <div className="meta-item">
                                    <FaPhone />
                                    <span style={{ fontSize: '11px' }}>{teacher.phone}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="header-actions-area">
                    <button
                        className="btn-premium primary"
                        onClick={onEditRequest}
                    >
                        <FaEdit />
                        <span>Edit Profile</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeacherHeader;
