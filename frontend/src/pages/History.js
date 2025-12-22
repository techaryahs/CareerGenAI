import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Added for video call navigation
import { io } from "socket.io-client"; // ✅ Added for real-time updates
import "../styles/History.css";
import PageLoader from "../components/PageLoader";

const History = () => {
  const [receiptUrl, setReceiptUrl] = useState(null);
  const [receiptStatus, setReceiptStatus] = useState(null);
  const [premiumPlan, setPremiumPlan] = useState(null);
  const [premiumExpiresAt, setPremiumExpiresAt] = useState(null);
  const [premiumStartDate, setPremiumStartDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalImg, setModalImg] = useState(null);

  // 🔹 counselling bookings
  const [counsellingBookings, setCounsellingBookings] = useState([]);

  // 🔹 active tab
  const [activeTab, setActiveTab] = useState("payment"); // "payment" | "counselling"

  // ✅ Active meetings tracking (bookingId -> true if counselor is in meeting)
  const [activeMeetings, setActiveMeetings] = useState(new Set());

  // ✅ Navigation hook for video call
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchReceipt = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/user/${user.email}`);
      const data = await res.json();

      if (res.ok) {
        if (data.receiptStatus === "denied") {
          await fetch(`${process.env.REACT_APP_API_URL}/api/user/delete-receipt`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email }),
          });
          setReceiptUrl(null);
          setReceiptStatus(null);
        } else {
          setReceiptUrl(data.receiptUrl);
          setReceiptStatus(data.receiptStatus);
          setPremiumPlan(data.premiumPlan);
          setPremiumExpiresAt(data.premiumExpiresAt);
          setPremiumStartDate(data.premiumStartDate || data.updatedAt || data.createdAt);
        }
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch receipt. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  const fetchCounsellingBookings = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/bookings/counselling/${user.email}`);
      const data = await res.json();
      if (res.ok) {
        setCounsellingBookings(data.bookings || []);
      }
    } catch (err) {
      console.error("Error fetching counselling bookings:", err);
    }
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) {
      fetchReceipt();
      fetchCounsellingBookings();
    } else {
      setLoading(false);
    }
  }, [fetchCounsellingBookings, fetchReceipt, user?.email]);

  // ✅ Socket.IO connection for real-time meeting status updates
  useEffect(() => {
    const webrtcServerUrl = process.env.REACT_APP_WEBRTC_SERVER_URL || 'http://localhost:8002';
    const socket = io(webrtcServerUrl);

    console.log('📡 Connected to WebRTC server for meeting status updates');

    // Listen for when counselor starts a call
    socket.on('call-started', ({ sessionId, meetingId }) => {
      console.log('🎬 Counselor started meeting:', sessionId);
      setActiveMeetings(prev => new Set(prev).add(sessionId));
    });

    // Listen for when call ends
    socket.on('call-ended', ({ sessionId }) => {
      console.log('🛑 Meeting ended:', sessionId);
      setActiveMeetings(prev => {
        const newSet = new Set(prev);
        newSet.delete(sessionId);
        return newSet;
      });
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);



  const formatDate = (date) => {
    const parsed = new Date(date);
    if (parsed.toString() === "Invalid Date") return "N/A";
    return parsed.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateTime) => {
    const parsed = new Date(dateTime);
    if (parsed.toString() === "Invalid Date") return "N/A";

    return parsed.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };


  const getDaysLeft = () => {
    if (!premiumExpiresAt) return null;
    const now = new Date();
    const end = new Date(premiumExpiresAt);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const getPlanLabel = (key) => {
    switch (key) {
      case "1month":
        return "1 Month";
      case "2months":
        return "2 Months";
      case "3months":
        return "3 Months";
      default:
        return "default";
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="history-container">

      {/* 🔹 Tabs */}
      <div className="tabs flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("payment")}
          className={`px-4 py-2 rounded-md font-medium ${activeTab === "payment"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700"
            }`}
        >
          🧾 Payment History
        </button>
        <button
          onClick={() => setActiveTab("counselling")}
          className={`px-4 py-2 rounded-md font-medium ${activeTab === "counselling"
            ? "bg-blue-600 text-white"
            : "bg-gray-200 text-gray-700"
            }`}
        >
          👩‍🏫 Counselling Booking History
        </button>
      </div>

      {/* 🔹 Section: Payment History */}
      {activeTab === "payment" && (
        <>
          {error ? (
            <p className="error">{error}</p>
          ) : receiptUrl ? (
            <div className="receipt-table-wrapper">
              <table className="receipt-table w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Receipt</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Plan</th>
                    <th className="border p-2">Start Date</th>
                    <th className="border p-2">End Date</th>
                    <th className="border p-2">Days Left</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">
                      <img
                        src={receiptUrl}
                        alt="Your receipt"
                        className="receipt-thumb cursor-pointer"
                        onClick={() => setModalImg(receiptUrl)}
                      />
                    </td>
                    <td className="border p-2">
                      <strong
                        className={
                          receiptStatus === "approved"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }
                      >
                        {receiptStatus === "approved" ? "✅ Approved" : "⏳ Pending"}
                      </strong>
                    </td>
                    <td className="border p-2">{getPlanLabel(premiumPlan)}</td>
                    <td className="border p-2">{formatDate(premiumStartDate)}</td>
                    <td className="border p-2">
                      {premiumExpiresAt ? formatDate(premiumExpiresAt) : "N/A"}
                    </td>
                    <td className="border p-2">
                      {premiumExpiresAt ? `${getDaysLeft()} days` : "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p>No receipt uploaded yet.</p>
          )}
        </>
      )}

      {/* 🔹 Section: Counselling Booking History */}
      {activeTab === "counselling" && (
        <>
          {counsellingBookings.length > 0 ? (
            <div className="receipt-table-wrapper">
              <table className="receipt-table w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Session Type</th>
                    <th className="border p-2">Date</th>
                    <th className="border p-2">Time</th>
                    <th className="border p-2">Booked On</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Action</th> {/* ✅ New Column */}
                  </tr>
                </thead>
                <tbody>
                  {counsellingBookings.map((booking, idx) => {
                    // Check if booking is valid for video call
                    const bookingDateTime = new Date(`${booking.date} ${booking.time}`);
                    const now = new Date();

                    // ✅ Calculate time difference in minutes
                    const timeDiffMinutes = (bookingDateTime - now) / (1000 * 60);

                    // ✅ Check if counselor has started this meeting
                    const isMeetingActive = activeMeetings.has(booking._id);

                    // ✅ NEW: Allow join if:
                    // 1. Within 5 minutes before session AND during/after session (up to 60 min), OR
                    // 2. Counselor has already joined the meeting
                    const timeWindowOpen = timeDiffMinutes <= 5 && timeDiffMinutes >= -60;
                    const canJoin = timeWindowOpen || isMeetingActive;

                    const isAccepted = booking.status === "accepted";
                    const sessionEnded = timeDiffMinutes < -60; // More than 60 minutes past session time

                    // Time until session
                    const getTimeStatus = () => {
                      if (sessionEnded) return "Session ended";
                      if (isMeetingActive) return "Counselor is waiting!";
                      if (timeDiffMinutes > 5) {
                        const hours = Math.floor(timeDiffMinutes / 60);
                        const mins = Math.floor(timeDiffMinutes % 60);
                        if (hours > 0) return `Opens in ${hours}h ${mins}m`;
                        return `Opens in ${mins}m`;
                      }
                      if (timeDiffMinutes > 0) return "Join now!";
                      if (timeDiffMinutes > -60) return "In progress";
                      return "Session ended";
                    };

                    return (
                      <tr key={idx}>
                        <td className="border p-2">{booking.consultantName}</td>
                        <td className="border p-2">{formatDate(booking.date)}</td>
                        <td className="border p-2">{booking.time}</td>
                        <td className="border p-2">{formatDateTime(booking.createdAt)}</td>
                        <td className="border p-2">
                          {booking.status === "accepted" && (
                            <span className="px-2 py-1 rounded bg-green-100 text-green-700 font-semibold">
                              Accepted ✅
                            </span>
                          )}
                          {booking.status === "rejected" && (
                            <span className="px-2 py-1 rounded bg-red-100 text-red-700 font-semibold">
                              Rejected ❌
                            </span>
                          )}
                          {booking.status === "pending" && (
                            <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 font-semibold">
                              Pending ⏳
                            </span>
                          )}
                        </td>
                        <td className="border p-2 text-center">
                          {isAccepted && !sessionEnded ? (
                            <div className="flex flex-col items-center gap-1">
                              <button
                                onClick={() => canJoin && navigate(`/video-call/${booking._id}`, { state: { booking } })}
                                disabled={!canJoin}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto ${canJoin
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  }`}
                                title={canJoin ? "Click to join video call" : getTimeStatus()}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Join Video Call
                              </button>
                              {!canJoin && (
                                <span className="text-xs text-gray-500">{getTimeStatus()}</span>
                              )}
                            </div>
                          ) : isAccepted && sessionEnded ? (
                            <span className="text-sm text-gray-400">Session ended</span>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No counselling sessions booked yet.</p>
          )}
        </>
      )}


      {/* Modal for receipt full view */}
      {modalImg && (
        <div className="modal-overlay" onClick={() => setModalImg(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={modalImg} alt="Full receipt" />
            <button className="close-modal" onClick={() => setModalImg(null)}>
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
