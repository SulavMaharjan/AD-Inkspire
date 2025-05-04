import React from "react";
import {
  BookOpen,
  Users,
  ShoppingCart,
  Settings,
  LogOut,
  Home,
} from "lucide-react";
import "../../styles/admin.css";

const AdminLayout = ({ children }) => {
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
              <a href="#" className="nav-link">
                <Home size={18} />
                <span>Dashboard</span>
              </a>
            </li>
            <li className="nav-item active">
              <a href="#" className="nav-link">
                <BookOpen size={18} />
                <span>Books</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <Users size={18} />
                <span>Members</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <ShoppingCart size={18} />
                <span>Orders</span>
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <Settings size={18} />
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <a href="#" className="logout-link">
            <LogOut size={18} />
            <span>Logout</span>
          </a>
        </div>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <div className="admin-header-search">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
            />
          </div>
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
