import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/Announcement.css";

const AnnouncementManagement = () => {
  const navigate = useNavigate();
  const { currentUser, token } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success' 
  });

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)), 
    announcementType: 'General'
  });


  const API_BASE_URL = 'https://localhost:7039'; 


  const getAuthToken = () => {
    let authToken = token;
    
    if (!authToken) {
      authToken = localStorage.getItem('token');
    }
    
    return authToken;
  };

  const showNotification = (message, type = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });

    setTimeout(() => {
      setNotification(prev => ({...prev, show: false}));
    }, 5000);
  };

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const authToken = getAuthToken();
      
      if (!authToken) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/Announcements`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch announcements: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      setAnnouncements(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userRole = currentUser?.role || localStorage.getItem("role");
    
    if (!userRole || 
        (userRole !== "SuperAdmin" && userRole !== "Staff")) {
      navigate('/unauthorized');
      return;
    }
    
    fetchAnnouncements();
  }, [currentUser, navigate, token]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


  const handleDateChange = (date, field) => {
    setFormData({
      ...formData,
      [field]: date
    });
  };


  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      announcementType: 'General'
    });
    setEditMode(false);
    setCurrentAnnouncement(null);
  };


  const handleShowCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditAnnouncement = (announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      startDate: new Date(announcement.startDate),
      endDate: new Date(announcement.endDate),
      announcementType: announcement.announcementType
    });
    setEditMode(true);
    setCurrentAnnouncement(announcement);
    setShowForm(true);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const announcementData = {
        title: formData.title,
        content: formData.content,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        announcementType: formData.announcementType
      };

      const authToken = getAuthToken();
      
      if (!authToken) {
        throw new Error('Authentication token not found');
      }

      let response;
      
      if (editMode) {
        response = await fetch(`${API_BASE_URL}/api/Announcements/${currentAnnouncement.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(announcementData)
        });
      } else {
        response = await fetch(`${API_BASE_URL}/api/Announcements`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(announcementData)
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to ${editMode ? 'update' : 'create'} announcement: ${response.status} ${errorText}`);
      }

      fetchAnnouncements();
      
      setShowForm(false);
      resetForm();
      
      showNotification(`Announcement ${editMode ? 'updated' : 'created'} successfully!`);
      
    } catch (err) {
      setError(err.message);
      console.error(`Error ${editMode ? 'updating' : 'creating'} announcement:`, err);
      
      showNotification(`Failed to ${editMode ? 'update' : 'create'} announcement: ${err.message}`, 'error');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) {
      return;
    }
    
    try {
      const authToken = getAuthToken();
      
      if (!authToken) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/Announcements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete announcement: ${response.status} ${errorText}`);
      }

      fetchAnnouncements();
      
      showNotification("Announcement deleted successfully!");
      
    } catch (err) {
      setError(err.message);
      console.error('Error deleting announcement:', err);
      
      showNotification(`Failed to delete announcement: ${err.message}`, 'error');
    }
  };

  const isActive = (startDate, endDate) => {
    const now = new Date();
    return new Date(startDate) <= now && new Date(endDate) >= now;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeClass = (startDate, endDate) => {
    if (isActive(startDate, endDate)) {
      return 'status-badge-active';
    } else if (new Date(startDate) > new Date()) {
      return 'status-badge-scheduled';
    } else {
      return 'status-badge-expired';
    }
  };

  const getStatusText = (startDate, endDate) => {
    if (isActive(startDate, endDate)) {
      return 'Active';
    } else if (new Date(startDate) > new Date()) {
      return 'Scheduled';
    } else {
      return 'Expired';
    }
  };

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    const aStatus = isActive(a.startDate, a.endDate) ? 0 : new Date(a.startDate) > new Date() ? 1 : 2;
    const bStatus = isActive(b.startDate, b.endDate) ? 0 : new Date(b.startDate) > new Date() ? 1 : 2;
    
    if (aStatus !== bStatus) {
      return aStatus - bStatus;
    }
    
    return new Date(b.startDate) - new Date(a.startDate);
  });

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  return (
    <div className="announcement-container">
      {notification.show && (
        <div className={`notification-toast ${notification.type}`}>
          <span className="notification-icon">{getNotificationIcon(notification.type)}</span>
          <span className="notification-message">{notification.message}</span>
          <button 
            className="notification-close"
            onClick={() => setNotification(prev => ({...prev, show: false}))}
          >
            &times;
          </button>
        </div>
      )}

      <div className="announcement-header">
        <h1>Announcement Management</h1>
        <button className="btn-create" onClick={handleShowCreateForm}>
          <span>+</span> Create New Announcement
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span> {error}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-container">
            <form className="announcement-form" onSubmit={handleSubmit}>
              <div className="form-header">
                <h2>{editMode ? 'Edit Announcement' : 'Create New Announcement'}</h2>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowForm(false)}
                >
                  &times;
                </button>
              </div>

              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="5"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <DatePicker
                    selected={formData.startDate}
                    onChange={(date) => handleDateChange(date, 'startDate')}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="datepicker-input"
                  />
                </div>

                <div className="form-group">
                  <label>End Date</label>
                  <DatePicker
                    selected={formData.endDate}
                    onChange={(date) => handleDateChange(date, 'endDate')}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="datepicker-input"
                    minDate={formData.startDate}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="announcementType">Announcement Type</label>
                <select
                  id="announcementType"
                  name="announcementType"
                  value={formData.announcementType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="General">General</option>
                  <option value="Important">Important</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Promotion">Promotion</option>
                  <option value="Event">Event</option>
                </select>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-submit"
                >
                  {editMode ? 'Update' : 'Create'} Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="content-wrapper">
        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Loading announcements...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📢</div>
            <p>No announcements found.</p>
            <button 
              className="btn-create-empty"
              onClick={handleShowCreateForm}
            >
              Create your first announcement
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="announcements-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Content</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedAnnouncements.map((announcement) => (
                  <tr key={announcement.id} className={isActive(announcement.startDate, announcement.endDate) ? 'row-active' : ''}>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(announcement.startDate, announcement.endDate)}`}>
                        {getStatusText(announcement.startDate, announcement.endDate)}
                      </span>
                    </td>
                    <td className="title-cell">{announcement.title}</td>
                    <td>{announcement.announcementType}</td>
                    <td className="content-cell">{announcement.content}</td>
                    <td>{formatDate(announcement.startDate)}</td>
                    <td>{formatDate(announcement.endDate)}</td>
                    <td className="actions-cell">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEditAnnouncement(announcement)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementManagement;