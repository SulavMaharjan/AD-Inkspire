import React from 'react';
import { BookOpen, ShoppingBag, Users, BarChart, Settings, LogOut } from 'lucide-react';
import '../../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="staff-sidebar">
      <div className="logo">
        <BookOpen size={24} />
        <h2>Inkspire</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li className="active">
            <ShoppingBag size={20} />
            <span>Orders</span>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="staff-info">
          <div className="avatar">SM</div>
          <div className="info">
            <p className="name">Sulav Maharjan</p>
            <p className="role">Senior Staff</p>
          </div>
        </div>
        <button className="logout-button">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;