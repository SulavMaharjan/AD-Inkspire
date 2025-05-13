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

    // Simulate a slight delay for better UX
    const timer = setTimeout(() => {
      loadUserProfile();
    }, 800);

    return () => clearTimeout(timer);
  }, [currentUser]);

  if (loading) {
    return (
      <div className="user-profile-body">
        <Navbar />
        <div className="user-profile-loading">
          <div className="user-profile-spinner"></div>
          <p>Loading your profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile-body">
        <Navbar />
        <div className="user-profile-error">
          <div className="user-profile-error-card">
            <div className="user-profile-error-icon">!</div>
            <h2>Error Loading Profile</h2>
            <p>{error}</p>
            <Link
              to="/login"
              className="user-profile-button user-profile-button-primary"
            >
              Go to Login
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="user-profile-body">
        <Navbar />
        <div className="user-profile-error">
          <div className="user-profile-error-card">
            <div className="user-profile-error-icon">?</div>
            <h2>User Not Found</h2>
            <p>Unable to find user information. Please log in again.</p>
            <Link
              to="/login"
              className="user-profile-button user-profile-button-primary"
            >
              Go to Login
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="user-profile-body">
      <Navbar />
      <div className="user-profile-page">
        <div className="user-profile-card">
          <div className="user-profile-header">
            <div className="user-profile-avatar">
              {userProfile.name
                ? userProfile.name.charAt(0).toUpperCase()
                : "U"}
            </div>
            <h1 className="user-profile-username">
              {userProfile.name || "User"}
            </h1>
            <p className="user-profile-role">{userProfile.role || "Member"}</p>
          </div>

          <div className="user-profile-details">
            <div className="user-profile-detail-row">
              <span className="user-profile-detail-label">Member ID</span>
              <span className="user-profile-detail-value">
                {userProfile.id || "Not available"}
              </span>
            </div>

            <div className="user-profile-detail-row">
              <span className="user-profile-detail-label">Username</span>
              <span className="user-profile-detail-value">
                {userProfile.userName || "Not available"}
              </span>
            </div>

            <div className="user-profile-detail-row">
              <span className="user-profile-detail-label">Email</span>
              <span className="user-profile-detail-value">
                {userProfile.email || "Not available"}
              </span>
            </div>
          </div>

          <div className="user-profile-footer">
            <Link
              to="/"
              className="user-profile-button user-profile-button-secondary"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfilePage;
