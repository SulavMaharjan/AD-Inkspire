import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';
import '../../styles/Landing.css';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="overlay"></div>
      </div>
      <motion.div 
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="hero-title" variants={itemVariants}>
          Discover a World of Books at <span>Inkspire</span>
        </motion.h1>
        <motion.p className="hero-description" variants={itemVariants}>
          Your gateway to endless knowledge and imagination. Explore our vast collection of books and join our growing community of readers.
        </motion.p>
        <motion.div className="hero-buttons" variants={itemVariants}>
          <Link to="/signup">
            <Button variant="primary" size="large">Join Now</Button>
          </Link>
          <Link to="/books">
            <Button variant="secondary" size="large">Explore Books</Button>
          </Link>
        </motion.div>
        <motion.div className="hero-stats" variants={itemVariants}>
          <div className="stat">
            <span className="stat-number">10,000+</span>
            <span className="stat-label">Books</span>
          </div>
          <div className="stat">
            <span className="stat-number">5,000+</span>
            <span className="stat-label">Members</span>
          </div>
          <div className="stat">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Online Access</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;