import { useEffect, useState, useCallback } from 'react';
import { getSocket } from '../utils/socket';

/**
 * Custom hook for Socket.IO connection management
 * Handles connection state and provides emit/on/off methods
 */
export const useSocket = () => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const socketInstance = getSocket();
        setSocket(socketInstance);

        const handleConnect = () => {
            console.log('✅ Socket connected:', socketInstance.id);
            setConnected(true);
        };

        const handleDisconnect = () => {
            console.log('⚠️ Socket disconnected');
            setConnected(false);
        };

        const handleConnectError = (error) => {
            console.error('❌ Socket connection error:', error.message);
            setConnected(false);
        };

        // Attach event listeners
        socketInstance.on('connect', handleConnect);
        socketInstance.on('disconnect', handleDisconnect);
        socketInstance.on('connect_error', handleConnectError);

        // Set initial connection state
        if (socketInstance.connected) {
            setConnected(true);
        }

        // Cleanup
        return () => {
            socketInstance.off('connect', handleConnect);
            socketInstance.off('disconnect', handleDisconnect);
            socketInstance.off('connect_error', handleConnectError);
        };
    }, []);

    // Emit event to server
    const emit = useCallback((event, data) => {
        if (socket) {
            socket.emit(event, data);
        }
    }, [socket]);

    // Subscribe to event
    const on = useCallback((event, handler) => {
        if (socket) {
            socket.on(event, handler);
        }
    }, [socket]);

    // Unsubscribe from event
    const off = useCallback((event, handler) => {
        if (socket) {
            socket.off(event, handler);
        }
    }, [socket]);

    return {
        socket,
        connected,
        emit,
        on,
        off
    };
};
