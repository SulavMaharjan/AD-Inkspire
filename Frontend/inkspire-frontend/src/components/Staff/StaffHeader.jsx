import React from "react";
import { Bell, User } from "lucide-react";
import "../../styles/StaffHeader.css";

const StaffHeader = ({ notification }) => {
  return (
    <header className="staff-header">
      <div className="header-title">
        <h1>Staff Portal</h1>
        <span className="subtitle">Order Processing System</span>
      </div>

      <div className="notification-area">
        {notification && (
          <div className={`notification ${notification.type}`}>
            <p>{notification.message}</p>
          </div>
        )}
      </div>

      <div className="staff-actions">
        <div className="staff-profile">
          <User size={20} />
          <span>Sulav Maharjan</span>
        </div>
      </div>
    </header>
  );
};

export default StaffHeader;
