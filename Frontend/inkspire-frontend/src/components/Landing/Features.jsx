import { motion } from 'framer-motion';
import { FaSearch, FaBookReader, FaCloudDownloadAlt, FaUserFriends, FaBell, FaMobileAlt } from 'react-icons/fa';
import '../../styles/Landing.css';

const Features = () => {
  const features = [
    {
      id: 1,
      icon: FaSearch,
      title: 'Advanced Search',
      description: 'Find books by genre, author, publication date, and more with our powerful search engine.'
    },
    {
      id: 2,
      icon: FaBookReader,
      title: 'Personalized Reading Lists',
      description: 'Create custom reading lists, track your progress, and get recommendations based on your interests.'
    },
    {
      id: 3,
      icon: FaCloudDownloadAlt,
      title: 'Digital Library',
      description: 'Access thousands of e-books and audiobooks from any device, anytime, anywhere.'
    },
    {
      id: 4,
      icon: FaUserFriends,
      title: 'Reading Community',
      description: 'Connect with other readers, join book clubs, and participate in literary discussions.'
    },
    {
      id: 5,
      icon: FaBell,
      title: 'Notifications & Reminders',
      description: 'Get notified about due dates, new arrivals, and recommended books tailored to your interests.'
    },
    {
      id: 6,
      icon: FaMobileAlt,
      title: 'Mobile Access',
      description: 'Enjoy a seamless experience on all devices with our responsive web application.'
    }
  ];
  
  return (
    <section className="features-section">
      <div className="features-header">
        <h2>Why Choose Inkspire</h2>
        <p>Discover the many ways our platform can enhance your reading experience</p>
      </div>
      
      <div className="features-grid">
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
          >
            <div className="feature-icon">
              <feature.icon />
            </div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;