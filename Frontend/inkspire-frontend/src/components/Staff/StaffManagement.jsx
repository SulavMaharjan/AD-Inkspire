import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import "../../styles/StaffManagement.css"; // Reusing the Members CSS

const StaffManagement = () => {
  const navigate = useNavigate();
  const { currentUser, token } = useAuth();
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form state for adding new staff
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userName: '',
    password: '',
    confirmPassword: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  
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

  const fetchStaffs = async () => {
    try {
      setLoading(true);
      const authToken = getAuthToken();
      
      if (!authToken) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/Staff/all`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch staffs: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      if (data.isSuccess) {
        setStaffs(data.staffs);
      } else {
        throw new Error(data.message || 'Failed to fetch staff members');
      }
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching staff members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userRole = currentUser?.role || localStorage.getItem("role");
    
    if (!userRole || (userRole !== "SuperAdmin" && userRole !== "Staff")) {
      navigate('/unauthorized');
      return;
    }
    
    fetchStaffs();
  }, [currentUser, navigate, token]);

  const handleDeleteStaff = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member? This action cannot be undone.')) {
      return;
    }
    
    try {
      const authToken = getAuthToken();
      
      if (!authToken) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/Staff/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete staff: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      if (data.isSuccess) {
        fetchStaffs();
        showNotification("Staff member deleted successfully!");
      } else {
        throw new Error(data.message || 'Failed to delete staff member');
      }
    } catch (err) {
      console.error('Error deleting staff member:', err);
      showNotification(`Failed to delete staff member: ${err.message}`, 'error');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.userName.trim()) errors.userName = 'Username is required';
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const authToken = getAuthToken();
      
      if (!authToken) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/Staff/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to add staff: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.isSuccess) {
        fetchStaffs();
        setShowAddModal(false);
        setFormData({
          name: '',
          email: '',
          userName: '',
          password: '',
          confirmPassword: ''
        });
        showNotification("Staff member added successfully!");
      } else {
        throw new Error(data.message || 'Failed to add staff member');
      }
    } catch (err) {
      console.error('Error adding staff member:', err);
      showNotification(`Failed to add staff member: ${err.message}`, 'error');
    }
  };

  const filteredStaffs = staffs.filter(staff => {
    return (
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const userRole = currentUser?.role || localStorage.getItem("role");
  const isSuperAdmin = userRole === "SuperAdmin";

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
        <h1>Staff Management</h1>
        {isSuperAdmin && (
          <button 
            className="btn-add-user" 
            onClick={() => setShowAddModal(true)}
          >
            Add New Staff
          </button>
        )}
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
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Loading staff members...</p>
          </div>
        ) : staffs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <p>No staff members found.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  {isSuperAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredStaffs.map((staff) => (
                  <tr key={staff.id}>
                    <td className="name-cell">{staff.name}</td>
                    <td>@{staff.userName}</td>
                    <td>{staff.email}</td>
                    {isSuperAdmin && (
                      <td className="actions-cell">
                        <button 
                          className="btn-delete"
                          onClick={() => handleDeleteStaff(staff.id)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Staff Member</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddStaff} className="staff-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Enter full name"
                  className={formErrors.name ? 'input-error' : ''}
                />
                {formErrors.name && <div className="error-text">{formErrors.name}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="userName">Username *</label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleFormChange}
                  placeholder="Enter username"
                  className={formErrors.userName ? 'input-error' : ''}
                />
                {formErrors.userName && <div className="error-text">{formErrors.userName}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Enter email address"
                  className={formErrors.email ? 'input-error' : ''}
                />
                {formErrors.email && <div className="error-text">{formErrors.email}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  placeholder="Enter password (min. 6 characters)"
                  className={formErrors.password ? 'input-error' : ''}
                />
                {formErrors.password && <div className="error-text">{formErrors.password}</div>}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleFormChange}
                  placeholder="Confirm password"
                  className={formErrors.confirmPassword ? 'input-error' : ''}
                />
                {formErrors.confirmPassword && <div className="error-text">{formErrors.confirmPassword}</div>}
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Add Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;