import React from "react";
import { User, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/StaffHeader.css";

const StaffHeader = ({ onLogout }) => {
  const { currentUser, currentRole, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      <header className="staff-portal-header">
        <div className="staff-header-title-container">
          <h1 className="staff-portal-main-title">Staff Portal</h1>
          <span className="staff-portal-subtitle">Order Processing System</span>
        </div>

        <div className="staff-header-actions">
          <div className="staff-profile-container">
            <div className="staff-avatar">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="staff-profile-info">
              <p className="staff-profile-name">{currentUser?.name || "User"}</p>
              {currentRole && <p className="staff-profile-role">{currentRole}</p>}
            </div>
          </div>

          <button onClick={handleLogout} className="staff-logout-btn">
            <LogOut size={18} />
            <span className="logout-btn-text">Logout</span>
          </button>
        </div>
      </header>
      <div className="staff-header-spacer"></div>
    </>
  );
};

export default StaffHeader;