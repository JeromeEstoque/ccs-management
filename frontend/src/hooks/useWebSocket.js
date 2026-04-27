import { useEffect, useRef, useState } from 'react';
import { useNotifications } from '../context/NotificationContext';

// WebSocket hook for real-time notifications
export const useWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  const ws = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const { addNotification } = useNotifications();

  const connect = () => {
    try {
      // For demo purposes, we'll simulate WebSocket connection
      // In production, replace with actual WebSocket URL
      // ws.current = new WebSocket(url);
      
      // Simulated connection
      console.log('Connecting to WebSocket...');
      setIsConnected(true);
      setError(null);

      // Mock WebSocket events
      setTimeout(() => {
        // Simulate receiving a message
        const mockMessage = {
          type: 'notification',
          data: {
            type: 'violation',
            title: 'New Violation Recorded',
            message: 'A violation has been recorded for student John Doe',
            timestamp: new Date(),
            read: false,
            icon: 'AlertTriangle',
            color: 'orange',
            actionUrl: '/admin/violations'
          }
        };
        
        setLastMessage(mockMessage);
        addNotification(mockMessage.data);
      }, 5000);

      // Uncomment below for real WebSocket implementation
      /*
      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
      };

      ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setLastMessage(message);
        
        // Handle different message types
        if (message.type === 'notification') {
          addNotification(message.data);
        }
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Connection error');
        setIsConnected(false);
      };
      */

    } catch (err) {
      console.error('Failed to connect to WebSocket:', err);
      setError('Failed to connect');
      setIsConnected(false);
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    
    setIsConnected(false);
  };

  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  };

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [url]);

  return {
    isConnected,
    lastMessage,
    error,
    sendMessage,
    disconnect
  };
};

// Polling hook as fallback for WebSocket
export const usePollingNotifications = (interval = 30000) => {
  const { addNotification } = useNotifications();
  const intervalRef = useRef(null);

  useEffect(() => {
    // Simulate polling for new notifications
    const pollNotifications = () => {
      // In production, this would be an API call
      // Example: fetch('/api/notifications/new')
      
      // Mock random notification
      if (Math.random() > 0.7) {
        const notificationTypes = [
          {
            type: 'violation',
            title: 'New Violation Recorded',
            message: 'A violation has been recorded',
            icon: 'AlertTriangle',
            color: 'orange'
          },
          {
            type: 'capstone',
            title: 'Capstone Request',
            message: 'New capstone group request',
            icon: 'BookOpen',
            color: 'purple'
          },
          {
            type: 'system',
            title: 'System Update',
            message: 'System activity detected',
            icon: 'Activity',
            color: 'blue'
          }
        ];

        const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        
        addNotification({
          ...randomNotification,
          timestamp: new Date(),
          read: false
        });
      }
    };

    // Start polling
    intervalRef.current = setInterval(pollNotifications, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval, addNotification]);

  return null;
};

export default useWebSocket;
