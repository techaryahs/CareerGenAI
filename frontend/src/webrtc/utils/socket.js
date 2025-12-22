import { io } from 'socket.io-client';
import { SERVER_URL } from './constants';

let socket = null;

/**
 * Get or create socket instance
 * Singleton pattern to ensure only one socket connection
 */
export const getSocket = () => {
    if (!socket) {
        socket = io(SERVER_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
            timeout: 10000
        });

        // Socket connection event listeners
        socket.on('connect', () => {
            console.log('✅ Socket connected:', socket.id);
        });

        socket.on('disconnect', (reason) => {
            console.log('❌ Socket disconnected:', reason);
        });

        socket.on('connect_error', (error) => {
            console.error('❌ Socket connection error:', error.message);
        });
    }
    return socket;
};

/**
 * Disconnect and cleanup socket
 */
export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
