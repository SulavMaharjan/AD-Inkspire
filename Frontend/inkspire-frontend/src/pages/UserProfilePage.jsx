import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../styles/UserProfilePage.css";
import Navbar from "../components/Navigation/Navbar";
import Footer from "../components/Landing/Footer";

const UserProfilePage = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const loadUserProfile = () => {
      try {
        if (currentUser) {
          setUserProfile(currentUser);
        } else {
          setError("No user information found. Please log in again.");
        }
      } catch (err) {
        setError("Failed to load user profile.");
        console.error("Error loading user profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <div className="error-card">
          <div className="error-icon">!</div>
          <h2>Error Loading Profile</h2>
          <p>{error}</p>
          <Link to="/login" className="profile-button primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="profile-error">
        <div className="error-card">
          <div className="error-icon">?</div>
          <h2>User Not Found</h2>
          <p>Unable to find user information. Please log in again.</p>
          <Link to="/login" className="profile-button primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {userProfile.name
                ? userProfile.name.charAt(0).toUpperCase()
                : "U"}
            </div>
            <h1>{userProfile.name || "User"}</h1>
            <p className="profile-role">{userProfile.role || "Member"}</p>
          </div>

          <div className="profile-details">
            <div className="detail-row">
              <span className="detail-label">Member ID</span>
              <span className="detail-value">
                {userProfile.id || "Not available"}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Username</span>
              <span className="detail-value">
                {userProfile.userName || "Not available"}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Email</span>
              <span className="detail-value">
                {userProfile.email || "Not available"}
              </span>
            </div>
          </div>

          <div className="profile-footer">
            <Link to="/" className="profile-button secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfilePage;
