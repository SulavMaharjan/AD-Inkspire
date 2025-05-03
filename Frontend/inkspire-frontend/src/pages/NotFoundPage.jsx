import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBook, FaHome } from 'react-icons/fa';
import Button from '../components/UI/Button';
import '../styles/Pages.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <motion.div 
        className="not-found-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="not-found-logo">
          <FaBook />
        </div>
        
        <h1>404</h1>
        <h2>Page Not Found</h2>
        
        <p>Oops! The page you are looking for seems to be missing from our library.</p>
        
        <Link to="/">
          <Button variant="primary" icon={<FaHome />}>
            Return to Homepage
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;