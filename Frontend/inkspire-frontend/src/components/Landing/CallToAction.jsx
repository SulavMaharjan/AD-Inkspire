import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';
import '../../styles/Landing.css';

const CallToAction = () => {
  return (
    <section className="cta-section">
      <div className="cta-content">
        <motion.div
          className="cta-text"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Ready to begin your reading journey?</h2>
          <p>Join thousands of readers who have already discovered the joy of Inkspire. Sign up today and get immediate access to our extensive collection of books.</p>
        </motion.div>
        
        <motion.div 
          className="cta-buttons"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link to="/signup">
            <Button variant="primary" size="large">Create an Account</Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="large">Sign In</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;