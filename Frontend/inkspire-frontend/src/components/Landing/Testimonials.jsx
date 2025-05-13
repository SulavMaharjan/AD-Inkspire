import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../../styles/Landing.css';
import AashrayaImage from "../Landing/LandingImages/Aashraya.jpeg";
import SulavImage from "../Landing/LandingImages/Sulav.jpeg";
const testimonials = [
  {
    id: 1,
    name: 'Aashraya Shrestha',
    role: 'Book Enthusiast',
    quote: "Inkspire has completely transformed my reading experience. The recommendations are spot-on, and I've discovered so many amazing books I would have otherwise missed.",
    image: AashrayaImage
  },
  {
    id: 2,
    name: 'Sulav Maharjan',
    role: 'Professor',
    quote: 'As an educator, I find Inkspire invaluable for both my research and teaching. The organized collections and search functionality save me countless hours.',
    image: SulavImage
  },
  {
    id: 3,
    name: 'Anjan Giri',
    role: 'Student',
    quote: 'Being able to access textbooks and research materials from anywhere has been a game-changer for my studies. The interface is intuitive and the mobile experience is seamless.',
    image: 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=300'
  }
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const autoplayRef = useRef(null);
  
  const nextSlide = () => {
    setCurrent(current => (current === testimonials.length - 1 ? 0 : current + 1));
  };
  
  const prevSlide = () => {
    setCurrent(current => (current === 0 ? testimonials.length - 1 : current - 1));
  };
  
  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setInterval(nextSlide, 5000);
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [autoplay, current]);
  
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);
  
  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <h2>What Our Users Say</h2>
        <p>Hear from our community of readers and book lovers</p>
      </div>
      
      <div 
        className="testimonial-carousel"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button 
          className="carousel-button prev" 
          onClick={prevSlide}
          aria-label="Previous testimonial"
        >
          <FaChevronLeft />
        </button>
        
        <div className="testimonial-window">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="testimonial-card"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="testimonial-quote">
                <FaQuoteLeft className="quote-icon" />
                <p>{testimonials[current].quote}</p>
              </div>
              <div className="testimonial-author">
                <img 
                  src={testimonials[current].image} 
                  alt={testimonials[current].name} 
                  className="author-image" 
                />
                <div className="author-info">
                  <h4>{testimonials[current].name}</h4>
                  <p>{testimonials[current].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <button 
          className="carousel-button next" 
          onClick={nextSlide}
          aria-label="Next testimonial"
        >
          <FaChevronRight />
        </button>
        
        <div className="carousel-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === current ? 'active' : ''}`}
              onClick={() => setCurrent(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;