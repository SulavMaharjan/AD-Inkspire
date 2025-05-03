import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBook } from 'react-icons/fa';
import SignupForm from '../components/Auth/SignupForm';
import '../styles/Pages.css';

const SignupPage = () => {
  useEffect(() => {
    // Update page title
    document.title = 'Sign Up - Inkspire';
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="auth-overlay"></div>
      </div>
      
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <FaBook className="logo-icon" />
            <span className="logo-text">Inkspire</span>
          </Link>
        </div>
        
        <div className="auth-content">
          <motion.div 
            className="auth-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SignupForm />
          </motion.div>
          
          <div className="auth-image">
            <motion.div 
              className="image-message"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2>"A reader lives a thousand lives before he dies."</h2>
              <p>George R.R. Martin</p>
            </motion.div>
          </div>
        </div>
        
        <div className="auth-footer">
          <p>&copy; {new Date().getFullYear()} Inkspire. All rights reserved.</p>
          <div className="auth-footer-links">
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/help">Help</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;