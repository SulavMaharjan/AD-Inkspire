import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import "../../styles/Members.css";

const MemberManagement = () => {
  const navigate = useNavigate();
  const { currentUser, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success' 
  });

  const API_BASE_URL = 'https://localhost:7039'; 

  const getAuthToken = () => {
    return token || localStorage.getItem('token');
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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const authToken = getAuthToken();
      
      if (!authToken) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/SuperAdmin/members`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch members: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userRole = currentUser?.role || localStorage.getItem("role");
    
    if (!userRole || userRole !== "SuperAdmin") {
      navigate('/unauthorized');
      return;
    }
    
    fetchUsers();
  }, [currentUser, navigate, token]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
      return;
    }
    
    try {
      const authToken = getAuthToken();
      
      if (!authToken) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/SuperAdmin/members/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete member: ${response.status} ${errorText}`);
      }

      fetchUsers();
      showNotification("Member deleted successfully!");
    } catch (err) {
      console.error('Error deleting member:', err);
      showNotification(`Failed to delete member: ${err.message}`, 'error');
    }
  };

  const filteredUsers = users.filter(user => {
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="user-management-container">
      {notification.show && (
        <div className={`notification-toast ${notification.type}`}>
          <span className="notification-message">{notification.message}</span>
          <button 
            className="notification-close"
            onClick={() => setNotification(prev => ({...prev, show: false}))}
          >
            &times;
          </button>
        </div>
      )}

      <div className="user-management-header">
        <h1>Member Management</h1>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span> {error}
        </div>
      )}

      <div className="content-wrapper">
        <div className="search-filter">
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Loading members...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <p>No members found.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="name-cell">{user.name}</td>
                    <td>@{user.userName}</td>
                    <td>{user.email}</td>
                    <td className="actions-cell">
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteUser(user.id)}
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

export default MemberManagement;