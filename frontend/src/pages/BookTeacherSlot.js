import { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from "framer-motion";
import { FaCalendarAlt, FaClock, FaChalkboardTeacher, FaMapMarkerAlt } from 'react-icons/fa';

const BookTeacherSlot = () => {
    const { teacherId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const teacher = location.state?.teacher;

    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [classMode, setClassMode] = useState('');
    const [bookedTimes, setBookedTimes] = useState([]);
    const [isBooking, setIsBooking] = useState(false);

    const API = process.env.REACT_APP_API_URL;

    const fetchBookedSlots = useCallback(async () => {
        if (!date) return;
        try {
            const res = await axios.get(`${API}/api/bookings/teacher-slots`, {
                params: { teacherId, date }
            });
            setBookedTimes(res.data.bookedTimes || []);
        } catch (err) {
            console.error('Failed to fetch booked slots:', err.message);
            setBookedTimes([]);
        }
    }, [API, teacherId, date]);

    useEffect(() => {
        if (!teacher) {
            navigate('/search-teachers');
            return;
        }
        if (teacher.teachingMode !== 'both') {
            setClassMode(teacher.teachingMode);
        }
    }, [teacher, navigate]);

    useEffect(() => {
        fetchBookedSlots();
    }, [fetchBookedSlots]);

    const handleBooking = async () => {
        if (!date || !time || !classMode) {
            alert('Please select date, time and mode');
            return;
        }

        setIsBooking(true);
        try {
            const token = localStorage.getItem('token');
            const userData = JSON.parse(localStorage.getItem('user'));

            const payload = {
                teacherId,
                teacherEmail: teacher.email,
                teacherName: teacher.fullName,
                date,
                time,
                classMode,
                userEmail: userData.email,
                userPhone: userData.mobile || userData.phone,
                userName: userData.name || 'User'
            };

            const res = await axios.post(`${API}/api/bookings/book-teacher`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("✅ Class booked! Redirecting to payment...");
            navigate('/payment-redirection', { state: { teacher, booking: res.data.booking } });

        } catch (err) {
            alert(err.response?.data?.message || "Error booking slot");
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-xl border border-gray-100"
            >
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Book Your Class</h1>
                <p className="text-gray-500 mb-8">Scheduling with <span className="text-blue-600 font-bold">{teacher?.fullName}</span></p>

                {/* Mode Selection */}
                <div className="mb-8">
                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <FaChalkboardTeacher /> Choose Mode
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        {(teacher?.teachingMode === 'online' || teacher?.teachingMode === 'both') && (
                            <button
                                onClick={() => setClassMode('online')}
                                className={`p-4 rounded-2xl border-2 transition-all ${classMode === 'online' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                            >
                                <span className="block font-bold">Online</span>
                                <span className="text-xs">₹{teacher.onlinePrice}/hr</span>
                            </button>
                        )}
                        {(teacher?.teachingMode === 'offline' || teacher?.teachingMode === 'both') && (
                            <button
                                onClick={() => setClassMode('offline')}
                                className={`p-4 rounded-2xl border-2 transition-all ${classMode === 'offline' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-500 hover:border-gray-200'}`}
                            >
                                <span className="block font-bold">Offline</span>
                                <span className="text-xs">₹{teacher.offlinePrice}/hr</span>
                            </button>
                        )}
                    </div>
                    {classMode === 'offline' && teacher?.offlineLocation && (
                        <p className="mt-3 text-sm text-gray-500 flex items-center gap-1">
                            <FaMapMarkerAlt /> {teacher.offlineLocation}
                        </p>
                    )}
                </div>

                {/* Date Selection */}
                <div className="mb-8">
                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <FaCalendarAlt /> Select Date
                    </label>
                    <input
                        type="date"
                        value={date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full border-2 border-gray-100 rounded-2xl px-5 py-3 focus:border-blue-500 outline-none transition-all"
                    />
                </div>

                {/* Time Slots */}
                {date && (
                    <div className="mb-10">
                        <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <FaClock /> Available Time Slots
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {teacher?.slots.map((slot, idx) => {
                                const timeStr = `${slot.startTime} - ${slot.endTime}`;
                                const isBooked = bookedTimes.includes(timeStr);
                                return (
                                    <button
                                        key={idx}
                                        disabled={isBooked}
                                        onClick={() => setTime(timeStr)}
                                        className={`py-3 rounded-xl text-sm font-bold transition-all
                      ${isBooked
                                                ? "bg-gray-100 text-gray-300 cursor-not-allowed line-through"
                                                : time === timeStr
                                                    ? "bg-blue-600 text-white shadow-lg scale-105"
                                                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        {slot.startTime}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <button
                    onClick={handleBooking}
                    disabled={isBooking || !date || !time || !classMode}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white font-bold rounded-2xl shadow-xl transition-all"
                >
                    {isBooking ? "Confirming..." : "Confirm & Pay"}
                </button>
            </motion.div>
        </div>
    );
};

export default BookTeacherSlot;
