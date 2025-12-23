import React, { useState } from 'react';
import { FaTimes, FaUser, FaPhone, FaMapMarkerAlt, FaQuoteLeft } from 'react-icons/fa';
import "../../styles/parent/EditProfileModal.css";

const ParentEditModal = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        mobile: user?.mobile || '',
        location: user?.location || '',
        bio: user?.bio || '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            console.error("Update error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="edit-modal-content animate-pop" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Parent Profile</h2>
                    <button className="close-x" onClick={onClose}><FaTimes /></button>
                </div>

                <form onSubmit={handleSubmit} className="edit-form">
                    <div className="input-group">
                        <label><FaUser /> Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label><FaPhone /> Mobile Number</label>
                        <input
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            placeholder="Your contact number"
                        />
                    </div>

                    <div className="input-group">
                        <label><FaMapMarkerAlt /> Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. Mumbai, India"
                        />
                    </div>

                    <div className="input-group full-width">
                        <label><FaQuoteLeft /> Bio / Parenting Philosophy</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Tell us a bit about yourself..."
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ParentEditModal;
