import React, { useState, useRef, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../context/NotificationContext';
import NotificationItem from './NotificationItem';
import '../styles/Notification.css';

const NotificationIcon = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { notifications, unreadCount, markAllAsRead, clearAllNotifications } = useNotifications();
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="notification-container" ref={dropdownRef}>
      <button 
        className="notification-icon-button" 
        onClick={toggleDropdown}
        aria-label="Notifications"
      >
        <FaBell className="notification-icon" />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>
      
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            className="notification-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="notification-header">
              <h3>Notifications</h3>
              <div className="notification-actions">
                <button 
                  className="notification-action-button"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </button>
                <button 
                  className="notification-action-button"
                  onClick={clearAllNotifications}
                >
                  Clear all
                </button>
              </div>
            </div>
            
            <div className="notification-list">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))
              ) : (
                <div className="empty-notifications">
                  <p>No notifications</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationIcon;