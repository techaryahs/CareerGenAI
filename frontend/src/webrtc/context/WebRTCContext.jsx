import { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useMediaDevices } from '../hooks/useMediaDevices';
import { useWebRTC } from '../hooks/useWebRTC';

const WebRTCContext = createContext(null);

/**
 * WebRTC Context Provider
 * Manages global WebRTC state for the entire application
 */
export const WebRTCProvider = ({ children }) => {
    const [meetingState, setMeetingState] = useState({
        inMeeting: false,
        meetingId: null,
        participantName: null,
        isHost: false
    });

    const { socket, connected, emit, on, off } = useSocket();
    const {
        localStream,
        isAudioMuted,
        isVideoOff,
        toggleAudio,
        toggleVideo,
        getUserMedia,
        stopStream
    } = useMediaDevices();

    const { remoteStreams, participants } = useWebRTC(socket, localStream);

    // Generate participant ID
    const participantId = meetingState.participantName
        ? `${meetingState.participantName.replace(/\s+/g, '-')}-${Date.now()}`
        : null;

    // Join meeting when state changes
    useEffect(() => {
        const joinMeeting = async () => {
            if (meetingState.inMeeting && connected && !localStream) {
                try {
                    // Get user media first
                    await getUserMedia();

                    // Wait a bit for stream to be ready
                    setTimeout(() => {
                        if (socket && participantId) {
                            emit('join-meeting', {
                                meetingId: meetingState.meetingId,
                                participantId,
                                participantName: meetingState.participantName,
                                isHost: meetingState.isHost,
                                sessionId: meetingState.meetingId
                            });
                            console.log('✅ Joined meeting:', meetingState.meetingId);
                        }
                    }, 500);
                } catch (error) {
                    console.error('❌ Failed to access camera/microphone:', error);
                    // More specific error messages
                    if (error.name === 'NotAllowedError') {
                        alert('Camera/Microphone access denied. Please allow permissions and refresh the page to join the call.');
                    } else if (error.name === 'NotFoundError') {
                        alert('No camera or microphone found. Please connect a device and try again.');
                    } else {
                        alert(`Failed to access media devices: ${error.message}\n\nPlease check your camera and microphone permissions.`);
                    }
                    // Leave meeting on error
                    setMeetingState({
                        inMeeting: false,
                        meetingId: null,
                        participantName: null,
                        isHost: false
                    });
                }
            }
        };

        joinMeeting();
    }, [meetingState.inMeeting, connected]);

    // Update participant state when audio/video changes
    useEffect(() => {
        if (socket && meetingState.inMeeting && participantId) {
            emit('update-participant-state', {
                meetingId: meetingState.meetingId,
                participantId,
                isAudioMuted,
                isVideoOff
            });
        }
    }, [isAudioMuted, isVideoOff]);

    // Start meeting (create new session)
    const startMeeting = (name, bookingId) => {
        const newMeetingId = bookingId || generateMeetingId();
        setMeetingState({
            inMeeting: true,
            meetingId: newMeetingId,
            participantName: name,
            isHost: true
        });
    };

    // Join existing meeting
    const joinMeeting = (id, name) => {
        console.log('📞 Joining meeting:', id, name);

        setMeetingState({
            inMeeting: true,
            meetingId: id,
            participantName: name,
            isHost: false
        });

        // ✅ Emit start-call event to notify other participants
        if (socket) {
            setTimeout(() => {
                socket.emit('start-call', {
                    sessionId: id,
                    meetingId: id,
                    hostName: name,
                    duration: 60 // 60 minutes default
                });
                console.log('✅ Emitted start-call event for session:', id);
            }, 1000);
        }
    };

    // Leave meeting
    const leaveMeeting = () => {
        if (socket && participantId) {
            emit('leave-meeting', {
                meetingId: meetingState.meetingId,
                participantId
            });
        }
        stopStream();
        setMeetingState({
            inMeeting: false,
            meetingId: null,
            participantName: null,
            isHost: false
        });
        console.log('⬅️ Left meeting');
    };

    // Generate meeting ID
    const generateMeetingId = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let id = '';
        for (let i = 0; i < 12; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const value = {
        // Meeting state
        ...meetingState,
        connected,

        // Streams
        localStream,
        remoteStreams,
        participants,

        // Media controls
        isAudioMuted,
        isVideoOff,
        toggleAudio,
        toggleVideo,

        // Meeting actions
        startMeeting,
        joinMeeting,
        leaveMeeting,

        // Socket
        socket,
        emit,
        on,
        off
    };

    return (
        <WebRTCContext.Provider value={value}>
            {children}
        </WebRTCContext.Provider>
    );
};

/**
 * Hook to use WebRTC context
 */
export const useWebRTCContext = () => {
    const context = useContext(WebRTCContext);
    if (!context) {
        throw new Error('useWebRTCContext must be used within WebRTCProvider');
    }
    return context;
};
