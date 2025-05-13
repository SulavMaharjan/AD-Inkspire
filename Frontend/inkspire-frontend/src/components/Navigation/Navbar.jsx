import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBook, FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import NotificationIcon from "../Notification";
import Button from "../UI/Button";
import "../../styles/Navigation.css";
import { Bookmark, ShoppingCart } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === "/";

  const isMember = currentUser?.role || localStorage.getItem("role");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav
      className={`navbar ${scrolled || !isHome ? "navbar-scrolled" : ""} ${
        mobileMenuOpen ? "mobile-open" : ""
      }`}
    >
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FaBook className="logo-icon" />
          <span className="logo-text">Inkspire</span>
        </Link>

        <div className="navitemms">
          <>
            <Link to="/orderedBook">Orders</Link>
          </>
          <>
            <Link to="/bookmarkedlist">Bookmarks</Link>
          </>
          <>
            <Link to="/books">Books Catalog</Link>
          </>
        </div>

        <div className="navbar-actions">
          {currentUser ? (
            <>
              <Link to="/member/cart">
                <ShoppingCart size={20} />
              </Link>

              {isMember && <NotificationIcon />}
              <div className="user-menu-container">
                <button className="user-menu-button" onClick={toggleUserMenu}>
                  <FaUserCircle />
                  <span className="user-name">{currentUser.name}</span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      className="user-dropdown"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link to="member/profile" className="dropdown-item">
                        My Profile
                      </Link>
                      <button
                        className="dropdown-item logout"
                        onClick={handleLogout}
                      >
                        Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="nav-link">
                Log In
              </Link>
              <Link to="/signup" className="nav-button">
                <Button variant="primary" size="small">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mobile-menu-items">
                {currentUser ? (
                  <>
                    <button
                      className="mobile-nav-link logout"
                      onClick={handleLogout}
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="mobile-nav-link"
                      onClick={toggleMobileMenu}
                    >
                      Log In
                    </Link>
                    <Link
                      to="/signup"
                      className="mobile-nav-link"
                      onClick={toggleMobileMenu}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
