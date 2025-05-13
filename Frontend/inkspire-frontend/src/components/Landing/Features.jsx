import { motion } from "framer-motion";
import {
  FaSearch,
  FaBookReader,
  FaCloudDownloadAlt,
  FaUserFriends,
  FaBell,
  FaMobileAlt,
} from "react-icons/fa";
import "../../styles/Landing.css";

const Features = () => {
  const features = [
    {
      id: 1,
      icon: FaSearch,
      title: "Advanced Search",
      description:
        "Find books by genre, author, availability, price range, ratings, language, format, and more with our powerful search engine.",
    },
    {
      id: 2,
      icon: FaBookReader,
      title: "Personalized Collections",
      description:
        "Bookmark your favorite books, track availability status, and create wishlists for future purchases.",
    },
    {
      id: 3,
      icon: FaCloudDownloadAlt,
      title: "Exclusive Editions",
      description:
        "Access special editions including signed copies, limited editions, first editions, and collector's items.",
    },
    {
      id: 4,
      icon: FaUserFriends,
      title: "Member Benefits",
      description:
        "Enjoy progressive discounts (5% on 5+ books, 10% after 10 orders) and exclusive access to special collections.",
    },
    {
      id: 5,
      icon: FaBell,
      title: "Order Mails",
      description:
        "Get mails about order confirmations, pickup confirmations and more.",
    },
    {
      id: 6,
      icon: FaMobileAlt,
      title: "Mobile Access",
      description:
        "Enjoy a seamless experience on all devices with our responsive web application.",
    },
  ];

  return (
    <section className="features-section">
      <div className="features-header">
        <h2>Why Choose Inkspire</h2>
        <p>
          Discover the many ways our platform can enhance your reading
          experience
        </p>
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
              ease: "easeOut",
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
