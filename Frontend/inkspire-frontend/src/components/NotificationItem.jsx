import React, { useEffect } from 'react';
import { FaTimes, FaCheck, FaBullhorn } from 'react-icons/fa';
import { useNotifications } from '../context/NotificationContext';

const NotificationItem = ({ notification }) => {
  const { markAsRead, clearNotification } = useNotifications();
 
  // Debug output when component renders
  useEffect(() => {
    console.log('NotificationItem rendering with data:', notification);
    console.log('Notification type:', notification.type);
    console.log('Notification data:', notification.data);
  }, [notification]);

  const handleMarkAsRead = () => {
    markAsRead(notification.id);
  };
 
  const handleClear = (e) => {
    e.stopPropagation();
    clearNotification(notification.id);
  };
 
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
           ' ' + date.toLocaleDateString();
  };

  // Helper function to get title and content regardless of case
  const getNotificationContent = (data) => {
    if (!data) return { title: null, content: null };
    
    // Check for Title/title and Content/content properties
    const title = data.Title || data.title || null;
    const content = data.Content || data.content || null;
    
    return { title, content };
  };
 
  const renderNotificationContent = () => {
    const { type, data } = notification;
    const { title, content } = getNotificationContent(data);
   
    switch (type) {
      case 'NEW_ANNOUNCEMENT':
        return (
          <>
            <FaBullhorn className="notification-icon announcement" />
            <div className="notification-content">
              <h4>New Announcement</h4>
              {title && (
                <p className="notification-title">{title}</p>
              )}
              {content && (
                <p className="notification-description">
                  {content.substring(0, 100)}
                  {content.length > 100 ? '...' : ''}
                </p>
              )}
              <p className="notification-time">{formatTimestamp(notification.timestamp)}</p>
            </div>
          </>
        );
     
      case 'UPDATED_ANNOUNCEMENT':
        return (
          <>
            <FaBullhorn className="notification-icon update" />
            <div className="notification-content">
              <h4>Announcement Updated</h4>
              {title && (
                <p className="notification-title">{title}</p>
              )}
              {content && (
                <p className="notification-description">
                  {content.substring(0, 100)}
                  {content.length > 100 ? '...' : ''}
                </p>
              )}
              <p className="notification-time">{formatTimestamp(notification.timestamp)}</p>
            </div>
          </>
        );
     
      case 'DELETED_ANNOUNCEMENT':
        return (
          <>
            <FaBullhorn className="notification-icon delete" />
            <div className="notification-content">
              <h4>Announcement Removed</h4>
              {title && (
                <p className="notification-title">{title}</p>
              )}
              <p className="notification-time">{formatTimestamp(notification.timestamp)}</p>
            </div>
          </>
        );
     
      default:
        return (
          <>
            <FaBullhorn className="notification-icon" />
            <div className="notification-content">
              <h4>Notification</h4>
              <p className="notification-time">{formatTimestamp(notification.timestamp)}</p>
            </div>
          </>
        );
    }
  };
 
  return (
    <div
      className={`notification-item ${notification.read ? 'read' : 'unread'}`}
      onClick={handleMarkAsRead}
    >
      {renderNotificationContent()}
     
      <div className="notification-actions">
        {!notification.read && (
          <button
            className="notification-action-button mark-read"
            onClick={handleMarkAsRead}
            title="Mark as read"
          >
            <FaCheck />
          </button>
        )}
        <button
          className="notification-action-button clear"
          onClick={handleClear}
          title="Remove notification"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;