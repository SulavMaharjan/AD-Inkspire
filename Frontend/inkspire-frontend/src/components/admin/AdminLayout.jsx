import React from "react";
import {
  BookOpen,
  Users,
  ShoppingCart,
  Settings,
  LogOut,
  Home,
} from "lucide-react";
import { Link } from "react-router-dom";
import "../../styles/admin.css";
import { useNavigate } from "react-router-dom";

const AdminLayout = ({ children }) => {
const navigate = useNavigate();
  
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <BookOpen size={28} className="logo-icon" />
          <h2 className="sidebar-title">InkSpire</h2>
        </div>

        <nav className="sidebar-nav">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/admin/dashboard" className="admin-nav-link">
              <Home size={18} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/add-book" className="admin-nav-link">
              <BookOpen size={18} />
              <span>Add Books</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/books" className="admin-nav-link">
              <BookOpen size={18} />
              <span>Books</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/members" className="admin-nav-link">
              <Users size={18} />
              <span>Members</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/staffs" className="admin-nav-link">
              <Users size={18} />
              <span>Staffs</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/announcements" className="admin-nav-link">
              <Settings size={18} />
              <span>Announcements</span>
            </Link>
          </li>
        </ul>
      </nav>
        <div className="sidebar-footer">
          <a href="#" className="logout-link" onClick={() => navigate("/login")}>
            <LogOut size={18} />
            <span>Logout</span>
          </a>
        </div>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <div className="admin-header-profile">
            <span className="admin-name">Admin User</span>
            <div className="admin-avatar">AU</div>
          </div>
        </header>
        <div className="admin-content-wrapper">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
