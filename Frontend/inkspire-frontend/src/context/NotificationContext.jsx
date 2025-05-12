import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const { currentUser } = useAuth();
  
  // Configure API base URL - update with your backend URL and port
  const API_BASE_URL = 'https://localhost:7039';

  // WebSocket connection management
  const connectWebSocket = () => {
    // Only establish WebSocket connection if user is logged in
    if (!currentUser || !currentUser.id) {
      console.log('No user logged in, skipping WebSocket connection');
      return;
    }

    // Close any existing socket connection
    if (socketRef.current && socketRef.current.readyState !== WebSocket.CLOSED) {
      socketRef.current.close();
    }

    try {
      // Use the API base URL to determine the WebSocket URL
      const protocol = API_BASE_URL.startsWith('https') ? 'wss' : 'ws';
      const host = API_BASE_URL.replace(/(^\w+:|^)\/\//, '');
      const wsUrl = `${protocol}://${host}/ws?userId=${currentUser.id}`;
      
      console.log(`Attempting WebSocket connection to ${wsUrl}`);
      
      const newSocket = new WebSocket(wsUrl);
      socketRef.current = newSocket;

      newSocket.onopen = () => {
        console.log('WebSocket connection established');
        setIsConnected(true);
        
        // Clear any reconnect timeout when we successfully connect
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      newSocket.onmessage = (event) => {
        console.log('WebSocket message received:', event.data);
        try {
          const data = JSON.parse(event.data);
          console.log('Parsed WebSocket message:', data);
          
          // Handle different notification types
          if (data.type === 'NEW_ANNOUNCEMENT' ||
              data.type === 'UPDATED_ANNOUNCEMENT' ||
              data.type === 'DELETED_ANNOUNCEMENT') {
            handleNotification(data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      newSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      newSocket.onclose = (event) => {
        console.log(`WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}`);
        setIsConnected(false);
        
        // Attempt to reconnect after a delay, unless it was intentionally closed
        if (!event.wasClean) {
          console.log('Scheduling reconnect attempt in 5 seconds...');
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect WebSocket...');
            connectWebSocket();
          }, 5000);
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
    }
  };

  const handleNotification = (data) => {
    console.log("Processing notification in handleNotification:", data);
    
    // Ensure the data structure is correct
    let notificationData = data.data;
    
    // Create a new notification object
    const newNotification = {
      id: data.id || Date.now(),
      type: data.type,
      data: notificationData,
      read: false,
      timestamp: new Date()
    };
    
    // Log the structure of the notification we're about to add
    console.log("Creating notification with structure:", newNotification);
    
    setNotifications(prev => {
      // Check if this notification already exists (to avoid duplicates)
      const exists = prev.some(n => n.id === newNotification.id);
      if (exists) {
        return prev;
      }
      const updatedNotifications = [newNotification, ...prev];
      console.log("Updated notifications list:", updatedNotifications);
      return updatedNotifications;
    });
    
    setUnreadCount(prev => prev + 1);
    
    // Show browser notification with correct property access
    showBrowserNotification(data);
  };

  const showBrowserNotification = (data) => {
    // Check if browser notifications are supported and permissions granted
    if ('Notification' in window && Notification.permission === 'granted') {
      let title = 'New Notification';
      let options = {};
      
      // Properly access Title property regardless of case
      const notificationTitle = data.data?.Title || data.data?.title || '';
      
      switch (data.type) {
        case 'NEW_ANNOUNCEMENT':
          title = 'New Announcement';
          options = { 
            body: notificationTitle || 'A new announcement has been posted' 
          };
          break;
        case 'UPDATED_ANNOUNCEMENT':
          title = 'Announcement Updated';
          options = { 
            body: notificationTitle || 'An announcement has been updated' 
          };
          break;
        default:
          // Default notification options
          break;
      }
      
      new Notification(title, options);
    }
  };

  // Initialize WebSocket when component mounts or user changes
  useEffect(() => {
    connectWebSocket();

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [currentUser]); // Re-initialize socket when user changes

  // Handle server heartbeat to keep connection alive if needed
  useEffect(() => {
    let heartbeatInterval;
    
    if (isConnected && socketRef.current) {
      heartbeatInterval = setInterval(() => {
        if (socketRef.current.readyState === WebSocket.OPEN) {
          // Send heartbeat ping to keep connection alive
          socketRef.current.send(JSON.stringify({ type: 'PING' }));
        }
      }, 30000); // Send heartbeat every 30 seconds
    }
    
    return () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
      }
    };
  }, [isConnected]);

  // Debug notifications state changes
  useEffect(() => {
    console.log('Notifications state updated:', notifications);
  }, [notifications]);

  // The rest of your component functionality
  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    );
    
    // Update unread count
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const clearNotification = (notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      const newNotifications = prev.filter(n => n.id !== notificationId);
      
      // Update unread count if we're removing an unread notification
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      
      return newNotifications;
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Optional: Request notification permissions
  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  const value = {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    requestNotificationPermission
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;