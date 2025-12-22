import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useWebRTCContext } from '../webrtc/context/WebRTCContext';
import VideoCallRoom from '../webrtc/components/VideoCallRoom';

/**
 * VideoCallPage Component
 * Page wrapper for video call sessions linked to counselor bookings
 */
const VideoCallPage = () => {
    const { bookingId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { inMeeting, joinMeeting, leaveMeeting, connected } = useWebRTCContext();
    const [isJoining, setIsJoining] = useState(false);
    const [hasJoined, setHasJoined] = useState(false);

    // Get booking details from location state
    const booking = location.state?.booking;

    useEffect(() => {
        if (!booking) {
            // If no booking data, redirect to history
            alert('No booking information found. Please join from your booking history.');
            navigate('/history');
            return;
        }

        // Auto-join meeting when component mounts and connected
        if (!inMeeting && !isJoining && !hasJoined && connected) {
            setIsJoining(true);
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const userName = user?.name || 'User';

                console.log('🎬 Joining video call:', bookingId, userName);
                // Join meeting with booking ID as meeting ID
                joinMeeting(bookingId, userName);
                setHasJoined(true);
            } catch (error) {
                console.error('Error joining meeting:', error);
                alert('Failed to join video call. Please try again.');
                navigate('/history');
            } finally {
                setIsJoining(false);
            }
        }

        // Cleanup when leaving page
        return () => {
            if (inMeeting) {
                console.log('🚪 Leaving meeting on unmount');
                leaveMeeting();
            }
        };
    }, [booking, bookingId, connected]); // Remove inMeeting from deps to prevent re-joining

    // ✅ Calculate session duration (default 60 minutes)
    const sessionDuration = 60; // You can make this dynamic based on booking type

    if (!booking) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading booking information...</p>
                </div>
            </div>
        );
    }

    if (!connected) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Connecting to video call server...</p>
                    <p className="text-gray-400 text-sm mt-2">Please wait a moment</p>
                </div>
            </div>
        );
    }

    if (isJoining) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-900">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Joining video call...</p>
                    <p className="text-gray-400 text-sm mt-2">Setting up your camera and microphone</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Booking Info Banner */}
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-lg shadow-lg">
                <p className="text-sm text-gray-700">
                    <span className="font-semibold">Session with:</span> {booking.consultantName || booking.userEmail}
                </p>
                <p className="text-xs text-gray-500">
                    {booking.date} at {booking.time}
                </p>
            </div>

            {/* Video Call Room - ✅ Pass sessionDuration */}
            <VideoCallRoom sessionDuration={sessionDuration} />
        </div>
    );
};

export default VideoCallPage;
