import { useState } from 'react';
import VideoDisplay from './VideoCall/VideoDisplay';
import ChatPanel from './VideoCall/ChatPanel';
import ControlBar from './VideoCall/ControlBar';
import TopLeftControls from './VideoCall/TopLeftControls';
import CallInfo from './VideoCall/CallInfo';
import SessionTimer from './VideoCall/SessionTimer'; // ✅ Import SessionTimer
import { useWebRTCContext } from '../context/WebRTCContext';
import './VideoCallRoom.css'; // ✅ Import responsive CSS

/**
 * VideoCallRoom Component
 * Main video call interface combining all components
 */
const VideoCallRoom = ({ sessionDuration = 60 }) => { // ✅ Accept sessionDuration prop
    const [isChatOpen, setIsChatOpen] = useState(false);

    const {
        meetingId,
        participantName,
        connected,
        localStream,
        remoteStreams,
        participants,
        isAudioMuted,
        isVideoOff,
        toggleAudio,
        toggleVideo,
        leaveMeeting
    } = useWebRTCContext();

    // ✅ Handle session time expired - auto end call
    const handleSessionExpired = () => {
        alert('Session time has ended. The call will now end.');
        leaveMeeting();
    };

    const handleToggleMute = () => {
        toggleAudio();
    };

    const handleToggleCamera = () => {
        toggleVideo();
    };

    const handleEndCall = () => {
        if (window.confirm('Are you sure you want to end the call?')) {
            leaveMeeting();
        }
    };

    const handleToggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const handleToggleParticipants = () => {
        alert(`${participants.length + 1} participant(s) in this call`);
    };

    const handleCopyMeetingId = () => {
        if (meetingId) {
            navigator.clipboard.writeText(meetingId);
            alert('Meeting ID copied to clipboard!');
        }
    };

    if (!connected) {
        return (
            <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 text-center">
                    <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
                    <h2 className="text-2xl font-bold text-white mb-2">Connecting...</h2>
                    <p className="text-white/70">Please wait while we connect you to the meeting</p>
                </div>
            </div>
        );
    }

    // Get remote participant (for 1-to-1 calls, show first participant)
    const remoteParticipant = participants[0];
    const remoteStream = remoteParticipant
        ? remoteStreams.get(remoteParticipant.participantId)
        : null;

    return (
        <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex overflow-hidden">
            {/* Main video area */}
            <div className="flex-1 flex flex-col h-full">
                {/* Top bar */}
                <div className="flex items-center justify-between p-4 z-10 flex-shrink-0">
                    {/* Top left - Camera toggle */}
                    <TopLeftControls isCameraOn={!isVideoOff} onToggleCamera={handleToggleCamera} />

                    {/* Top center - Session Timer & Call info */}
                    <div className="flex flex-col items-center gap-2">
                        {/* ✅ Session Timer */}
                        <SessionTimer
                            sessionDuration={sessionDuration}
                            onTimeExpired={handleSessionExpired}
                            participantCount={participants.length + 1} // +1 for local user
                        />
                        {/* Call Info */}
                        <CallInfo meetingId={meetingId} onCopyMeetingId={handleCopyMeetingId} />
                    </div>

                    {/* Top right - spacer for balance */}
                    <div className="w-12" />
                </div>

                {/* Main video display */}
                <div className="flex-1 relative px-4 pb-4 pt-0 overflow-hidden">
                    <div className="h-full w-full rounded-2xl overflow-hidden relative">
                        {remoteParticipant ? (
                            <VideoDisplay
                                stream={remoteStream}
                                name={remoteParticipant.participantName}
                                isMain
                                cameraOff={!remoteStream}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl">
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-white/70 text-xl">Waiting for the counselor to join...</p>
                                    <p className="text-white/50 text-sm mt-2">Meeting ID: <span className="font-mono">{meetingId}</span></p>
                                </div>
                            </div>
                        )}

                        {/* Self view - bottom right */}
                        <div className="absolute bottom-4 right-4 shadow-2xl rounded-2xl overflow-hidden border-2 border-white/20 hover:border-purple-500/50 transition-colors cursor-pointer">
                            <VideoDisplay
                                stream={localStream}
                                name={participantName}
                                cameraOff={isVideoOff}
                                isMuted={isAudioMuted}
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom controls */}
                <div className="flex justify-center pb-4 flex-shrink-0">
                    <ControlBar
                        isMuted={isAudioMuted}
                        isCameraOn={!isVideoOff}
                        onToggleMute={handleToggleMute}
                        onToggleCamera={handleToggleCamera}
                        onEndCall={handleEndCall}
                        onToggleChat={handleToggleChat}
                        onToggleParticipants={handleToggleParticipants}
                        chatOpen={isChatOpen}
                    />
                </div>
            </div>

            {/* Chat panel */}
            <div className={`transition-all duration-300 h-full flex-shrink-0 ${isChatOpen ? "w-96" : "w-0 overflow-hidden"}`}>
                <div className="h-full">
                    <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
                </div>
            </div>
        </div>
    );
};

export default VideoCallRoom;
