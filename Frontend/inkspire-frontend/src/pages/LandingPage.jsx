import { useEffect } from "react";
import Navbar from "../components/Navigation/Navbar";
import Hero from "../components/Landing/Hero";
import Features from "../components/Landing/Features";
import Testimonials from "../components/Landing/Testimonials";
import CallToAction from "../components/Landing/CallToAction";
import Footer from "../components/Landing/Footer";
import "../styles/Pages.css";

const LandingPage = () => {
  useEffect(() => {
    document.title = "Inkspire - Your Digital Library";

    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="landing-page">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
