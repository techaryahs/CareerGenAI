import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";

import {
    generateMeetingId,
    verifyMeetingId,
    generateRandomMeetingId
} from "./meeting-id-generator.js";

const app = express();
const server = http.createServer(app);

// Configure CORS
app.use(cors());
app.use(express.json());

// Socket.IO setup with CORS
const io = new SocketIOServer(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Store active meetings and participants
const meetings = new Map();
const participants = new Map();
const activeCalls = new Map(); // Track active calls by session ID (in-memory)

app.get('/', (req, res) => {
    res.send('WebRTC Signaling Server is running.');
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        activeMeetings: meetings.size,
        activeParticipants: participants.size,
        activeCalls: activeCalls.size
    });
});

// Generate secure meeting ID from session ID
app.post('/generate-meeting-id', (req, res) => {
    const { sessionId } = req.body;

    if (!sessionId) {
        // Generate random meeting ID if no session ID provided
        const meetingId = generateRandomMeetingId();
        console.log(`🔐 Generated random meeting ID: ${meetingId}`);
        return res.json({
            meetingId,
            success: true
        });
    }

    const meetingId = generateMeetingId(sessionId);
    console.log(`🔐 Generated meeting ID for session ${sessionId}: ${meetingId}`);
    res.json({
        sessionId,
        meetingId,
        success: true
    });
});

// Check if a specific call is active
app.get('/call-status/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const callInfo = activeCalls.get(sessionId);
    res.json({
        sessionId,
        isActive: !!callInfo,
        callInfo: callInfo || null
    });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Start a call (host initiates)
    socket.on('start-call', ({ sessionId, meetingId, hostName, duration }) => {
        console.log(`📞 Host ${hostName} started call for session ${sessionId}`);

        const now = new Date();
        const endTime = new Date(now.getTime() + (duration || 30) * 60000);

        // Mark call as active in memory
        activeCalls.set(sessionId, {
            meetingId,
            hostName,
            startedAt: now.toISOString(),
            scheduledEndTime: endTime.toISOString(),
            duration: duration || 30,
            status: 'active'
        });

        // Broadcast to all clients that this call is now active
        io.emit('call-started', { sessionId, meetingId, hostName });
        socket.emit('call-start-confirmed', { sessionId, meetingId });
    });

    // Check if call is active
    socket.on('check-call-status', ({ sessionId }) => {
        const callInfo = activeCalls.get(sessionId);
        socket.emit('call-status-response', {
            sessionId,
            isActive: !!callInfo,
            callInfo: callInfo || null
        });
    });

    // End a call
    socket.on('end-call', ({ sessionId }) => {
        console.log(`📞 Call ended for session ${sessionId}`);

        // Remove from in-memory tracking
        activeCalls.delete(sessionId);

        // Broadcast to all clients that this call has ended
        io.emit('call-ended', { sessionId });
    });

    // Join a meeting room
    socket.on('join-meeting', ({ meetingId, participantId, participantName, isHost, sessionId }) => {
        console.log(`\n👤 ${participantName} (${participantId}) joining meeting ${meetingId}`);
        console.log(`   Socket ID: ${socket.id}`);
        if (sessionId) {
            console.log(`   📋 Session ID: ${sessionId}`);
        }

        // Join the Socket.IO room
        socket.join(meetingId);

        // Store participant info
        participants.set(socket.id, {
            socketId: socket.id,
            participantId,
            participantName,
            meetingId,
            isHost,
            isAudioMuted: false,
            isVideoOff: false,
            sessionId: sessionId || null,
        });

        // Add to meeting
        if (!meetings.has(meetingId)) {
            meetings.set(meetingId, new Set());
            console.log(`   📝 Created new meeting: ${meetingId}`);
        }
        meetings.get(meetingId).add(socket.id);

        // Notify others in the room
        const roomSize = meetings.get(meetingId).size;
        console.log(`   👥 Meeting ${meetingId} now has ${roomSize} participant(s)`);

        socket.to(meetingId).emit('participant-joined', {
            participantId,
            participantName,
            isHost
        });

        // Send current participants to the new joiner
        const currentParticipants = Array.from(meetings.get(meetingId))
            .map(sid => participants.get(sid))
            .filter(p => p && p.socketId !== socket.id);

        // If this is a host rejoining and there are already participants, emit host-rejoined
        if (isHost && currentParticipants.length > 0) {
            console.log(`🎯 Host ${participantName} rejoined meeting ${meetingId}`);
            socket.to(meetingId).emit('host-rejoined', {
                hostName: participantName,
                meetingId: meetingId,
                sessionId: sessionId
            });
        }

        console.log(`   📤 Sending ${currentParticipants.length} existing participant(s) to ${participantName}`);
        socket.emit('existing-participants', currentParticipants);

        // Log all participants in this meeting
        console.log(`   📋 All participants in ${meetingId}:`);
        Array.from(meetings.get(meetingId)).forEach(sid => {
            const p = participants.get(sid);
            if (p) {
                console.log(`      - ${p.participantName} (${p.participantId})`);
            }
        });
    });

    // WebRTC Signaling: Offer
    socket.on('offer', ({ meetingId, toParticipantId, offer }) => {
        const sender = participants.get(socket.id);
        console.log(`Offer from ${sender?.participantName} to ${toParticipantId}`);

        // Find the target participant's socket
        const targetSocket = Array.from(participants.entries())
            .find(([_, p]) => p.participantId === toParticipantId);

        if (targetSocket) {
            io.to(targetSocket[0]).emit('offer', {
                fromParticipantId: sender.participantId,
                fromParticipantName: sender.participantName,
                offer
            });
        }
    });

    // WebRTC Signaling: Answer
    socket.on('answer', ({ meetingId, toParticipantId, answer }) => {
        const sender = participants.get(socket.id);
        console.log(`Answer from ${sender?.participantName} to ${toParticipantId}`);

        // Find the target participant's socket
        const targetSocket = Array.from(participants.entries())
            .find(([_, p]) => p.participantId === toParticipantId);

        if (targetSocket) {
            io.to(targetSocket[0]).emit('answer', {
                fromParticipantId: sender.participantId,
                answer
            });
        }
    });

    // WebRTC Signaling: ICE Candidate
    socket.on('ice-candidate', ({ meetingId, toParticipantId, candidate }) => {
        const sender = participants.get(socket.id);

        // Find the target participant's socket
        const targetSocket = Array.from(participants.entries())
            .find(([_, p]) => p.participantId === toParticipantId);

        if (targetSocket) {
            io.to(targetSocket[0]).emit('ice-candidate', {
                fromParticipantId: sender.participantId,
                candidate
            });
        }
    });

    // Chat message
    socket.on('chat-message', ({ meetingId, message }) => {
        const sender = participants.get(socket.id);
        console.log(`Chat message from ${sender?.participantName} in meeting ${meetingId}`);

        // Broadcast to all OTHER participants in the meeting (exclude sender)
        socket.to(meetingId).emit('chat-message', message);
    });

    // Update participant state (audio/video)
    socket.on('update-participant-state', ({ meetingId, participantId, isAudioMuted, isVideoOff }) => {
        const participant = participants.get(socket.id);
        if (participant && participant.participantId === participantId) {
            // Update local state
            if (isAudioMuted !== undefined) participant.isAudioMuted = isAudioMuted;
            if (isVideoOff !== undefined) participant.isVideoOff = isVideoOff;

            // Broadcast to all participants
            io.to(meetingId).emit('participant-state-changed', {
                participantId,
                participantName: participant.participantName,
                isAudioMuted: participant.isAudioMuted,
                isVideoOff: participant.isVideoOff,
            });
        }
    });

    // Host mutes a participant
    socket.on('mute-participant', ({ meetingId, participantId }) => {
        const host = participants.get(socket.id);
        if (!host || !host.isHost) return;

        console.log(`Host ${host.participantName} muting ${participantId}`);

        // Find target participant's socket
        const targetSocket = Array.from(participants.entries())
            .find(([_, p]) => p.participantId === participantId);

        if (targetSocket) {
            const [targetSocketId, targetParticipant] = targetSocket;
            targetParticipant.isAudioMuted = true;

            // Notify the participant they were muted
            io.to(targetSocketId).emit('muted-by-host');

            // Broadcast state change to all
            io.to(meetingId).emit('participant-state-changed', {
                participantId,
                participantName: targetParticipant.participantName,
                isAudioMuted: true,
                isVideoOff: targetParticipant.isVideoOff,
            });
        }
    });

    // Host unmutes a participant
    socket.on('unmute-participant', ({ meetingId, participantId }) => {
        const host = participants.get(socket.id);
        if (!host || !host.isHost) return;

        console.log(`Host ${host.participantName} unmuting ${participantId}`);

        // Find target participant's socket
        const targetSocket = Array.from(participants.entries())
            .find(([_, p]) => p.participantId === participantId);

        if (targetSocket) {
            const [targetSocketId, targetParticipant] = targetSocket;
            targetParticipant.isAudioMuted = false;

            // Notify the participant they were unmuted
            io.to(targetSocketId).emit('unmuted-by-host');

            // Broadcast state change to all
            io.to(meetingId).emit('participant-state-changed', {
                participantId,
                participantName: targetParticipant.participantName,
                isAudioMuted: false,
                isVideoOff: targetParticipant.isVideoOff,
            });
        }
    });

    // Host removes a participant
    socket.on('remove-participant', ({ meetingId, participantId }) => {
        const host = participants.get(socket.id);
        if (!host || !host.isHost) return;

        console.log(`Host ${host.participantName} removing ${participantId}`);

        // Find target participant's socket
        const targetSocket = Array.from(participants.entries())
            .find(([_, p]) => p.participantId === participantId);

        if (targetSocket) {
            const [targetSocketId] = targetSocket;

            // Notify the participant they were removed
            io.to(targetSocketId).emit('removed-by-host');

            // Force disconnect after a short delay
            setTimeout(() => {
                const targetSocketObj = io.sockets.sockets.get(targetSocketId);
                if (targetSocketObj) {
                    targetSocketObj.disconnect(true);
                }
            }, 1000);
        }
    });

    // Leave meeting
    socket.on('leave-meeting', ({ meetingId, participantId }) => {
        handleParticipantLeave(socket, meetingId, participantId);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        const participant = participants.get(socket.id);
        if (participant) {
            handleParticipantLeave(socket, participant.meetingId, participant.participantId);
        }
    });
});

function handleParticipantLeave(socket, meetingId, participantId) {
    const participant = participants.get(socket.id);

    if (participant) {
        console.log(`${participant.participantName} left meeting ${meetingId}`);

        // Check if this is the host leaving
        const isHost = participant.isHost;
        const participantNameLeaving = participant.participantName;
        const sessionId = participant.sessionId;

        // Notify others
        socket.to(meetingId).emit('participant-left', {
            participantId: participant.participantId,
            participantName: participant.participantName
        });

        // If host is leaving, emit host-left event
        if (isHost) {
            console.log(`🎯 Host ${participantNameLeaving} left meeting ${meetingId}`);
            socket.to(meetingId).emit('host-left', {
                hostName: participantNameLeaving,
                meetingId: meetingId,
                sessionId: sessionId
            });
        }

        // Clean up
        socket.leave(meetingId);
        participants.delete(socket.id);

        if (meetings.has(meetingId)) {
            meetings.get(meetingId).delete(socket.id);

            // Remove meeting if empty
            if (meetings.get(meetingId).size === 0) {
                meetings.delete(meetingId);
                console.log(`Meeting ${meetingId} ended (no participants)`);
            }
        }
    }
}

const PORT = process.env.PORT || 8002;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
    console.log(`🚀 WebRTC Signaling Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✅ Server ready to accept connections`);
});
