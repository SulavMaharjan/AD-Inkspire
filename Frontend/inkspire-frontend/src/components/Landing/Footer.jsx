import { Link } from 'react-router-dom';
import { FaBook, FaTwitter, FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import '../../styles/Landing.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <FaBook className="logo-icon" />
              <span className="logo-text">Inkspire</span>
            </Link>
            <p className="footer-tagline">Your gateway to endless knowledge and imagination</p>
            <div className="footer-social">
              <a href="#" target="_blank" rel="noopener" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" target="_blank" rel="noopener" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" target="_blank" rel="noopener" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" target="_blank" rel="noopener" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="footer-links-column">
              <h3>Explore</h3>
              <ul>
                <li><Link to="/books">Books</Link></li>
                <li><Link to="/categories">Categories</Link></li>
                <li><Link to="/authors">Authors</Link></li>
                <li><Link to="/new-releases">New Releases</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h3>Account</h3>
              <ul>
                <li><Link to="/login">Sign In</Link></li>
                <li><Link to="/signup">Register</Link></li>
                <li><Link to="/profile">My Account</Link></li>
                <li><Link to="/reading-list">My Reading List</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h3>Help</h3>
              <ul>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/how-it-works">How It Works</Link></li>
                <li><Link to="/support">Support</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-legal">
            <p>&copy; {currentYear} Inkspire. All rights reserved.</p>
            <div className="footer-legal-links">
              <Link to="/terms">Terms of Service</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;