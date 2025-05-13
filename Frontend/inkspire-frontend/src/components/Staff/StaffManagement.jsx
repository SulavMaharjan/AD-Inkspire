import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import "../../styles/StaffManagement.css";

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
    <div className="staff-management-container">
      {notification.show && (
        <div className={`staff-notification-toast staff-notification-${notification.type}`}>
          <span className="staff-notification-message">{notification.message}</span>
          <button 
            className="staff-notification-close"
            onClick={() => setNotification(prev => ({...prev, show: false}))}
          >
            &times;
          </button>
        </div>
      )}

      <div className="staff-management-header">
        <h1 className="staff-management-title">Staff Management</h1>
        {isSuperAdmin && (
          <button 
            className="staff-add-button" 
            onClick={() => setShowAddModal(true)}
          >
            <i className="staff-add-icon">+</i> Add New Staff
          </button>
        )}
      </div>

      {error && (
        <div className="staff-error-message">
          <span className="staff-error-icon">⚠️</span> {error}
        </div>
      )}

      <div className="staff-content-wrapper">
        <div className="staff-search-filter">
          <input
            type="text"
            placeholder="Search staff by name, email or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="staff-search-input"
          />
          <span className="staff-search-icon">🔍</span>
        </div>

        {loading ? (
          <div className="staff-loading-container">
            <div className="staff-loader"></div>
            <p>Loading staff members...</p>
          </div>
        ) : staffs.length === 0 ? (
          <div className="staff-empty-state">
            <div className="staff-empty-icon">👤</div>
            <p>No staff members found.</p>
            {isSuperAdmin && (
              <button 
                className="staff-add-empty-button"
                onClick={() => setShowAddModal(true)}
              >
                Add Your First Staff Member
              </button>
            )}
          </div>
        ) : (
          <div className="staff-table-container">
            <table className="staff-table">
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
                    <td className="staff-name-cell">
                      <div className="staff-avatar">
                        {staff.name.charAt(0).toUpperCase()}
                      </div>
                      {staff.name}
                    </td>
                    <td className="staff-username-cell">{staff.userName}</td>
                    <td className="staff-email-cell">{staff.email}</td>
                    {isSuperAdmin && (
                      <td className="staff-actions-cell">
                        <button 
                          className="staff-delete-button"
                          onClick={() => handleDeleteStaff(staff.id)}
                        >
                          <i className="staff-delete-icon">🗑️</i> Delete
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
        <div className="staff-modal-overlay">
          <div className="staff-modal">
            <div className="staff-modal-header">
              <h2>Add New Staff Member</h2>
              <button 
                className="staff-modal-close"
                onClick={() => setShowAddModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddStaff} className="staff-form">
              <div className="staff-form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Enter full name"
                  className={formErrors.name ? 'staff-input-error' : ''}
                />
                {formErrors.name && <div className="staff-error-text">{formErrors.name}</div>}
              </div>
              
              <div className="staff-form-group">
                <label htmlFor="userName">Username *</label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleFormChange}
                  placeholder="Enter username"
                  className={formErrors.userName ? 'staff-input-error' : ''}
                />
                {formErrors.userName && <div className="staff-error-text">{formErrors.userName}</div>}
              </div>
              
              <div className="staff-form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="Enter email address"
                  className={formErrors.email ? 'staff-input-error' : ''}
                />
                {formErrors.email && <div className="staff-error-text">{formErrors.email}</div>}
              </div>
              
              <div className="staff-form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  placeholder="Enter password (min. 6 characters)"
                  className={formErrors.password ? 'staff-input-error' : ''}
                />
                {formErrors.password && <div className="staff-error-text">{formErrors.password}</div>}
              </div>
              
              <div className="staff-form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleFormChange}
                  placeholder="Confirm password"
                  className={formErrors.confirmPassword ? 'staff-input-error' : ''}
                />
                {formErrors.confirmPassword && <div className="staff-error-text">{formErrors.confirmPassword}</div>}
              </div>
              
              <div className="staff-form-actions">
                <button 
                  type="button" 
                  className="staff-cancel-button"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="staff-submit-button"
                >
                  Add Staff Member
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