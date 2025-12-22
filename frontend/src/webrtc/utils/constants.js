// WebRTC Constants and Configuration

// Server URL for WebRTC signaling
// For localhost development
export const SERVER_URL = process.env.REACT_APP_WEBRTC_SERVER_URL || 'http://localhost:8002';

// ICE servers for WebRTC peer connection
export const ICE_SERVERS = [
    {
        urls: 'stun:stun.l.google.com:19302'
    },
    {
        urls: 'stun:stun1.l.google.com:19302'
    }
];

// App constants
export const APP_NAME = 'CareerGenAI Video Call';
export const MAX_PARTICIPANTS = 2; // 1-to-1 calls only
export const DEFAULT_CALL_DURATION = 60; // minutes


// for localhost 
