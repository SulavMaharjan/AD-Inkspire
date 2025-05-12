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
    <header className="staff-header">
      <div className="header-title">
        <h1>Staff Portal</h1>
        <span className="subtitle">Order Processing System</span>
      </div>

      <div className="staff-actions">
        <div className="staff-profile">
          <div className="avatar">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="info">
            <p className="name">{currentUser?.name || "User"}</p>
            <p className="role">{currentRole || "Staff"}</p>
          </div>
        </div>

        <button onClick={handleLogout} className="logout-button">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default StaffHeader;
