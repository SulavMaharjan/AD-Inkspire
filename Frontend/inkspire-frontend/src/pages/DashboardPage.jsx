import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navigation/Navbar';
import '../styles/Pages.css';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  
  useEffect(() => {
    // Update page title
    document.title = 'Dashboard - Inkspire';
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome, {currentUser?.name}</h1>
          <p>
            {currentUser?.role === 'member' && 'Manage your reading experience'}
            {currentUser?.role === 'staff' && 'Manage library resources and assist members'}
            {currentUser?.role === 'admin' && 'Full administrative control of the library'}
          </p>
        </div>
        
        <div className="dashboard-content">
          <div className="dashboard-card">
            <h2>Dashboard Coming Soon</h2>
            <p>We're currently working on an amazing dashboard experience tailored specifically for {currentUser?.role}s.</p>
            <p>Check back soon to explore all the features and functionality of your Inkspire account!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;