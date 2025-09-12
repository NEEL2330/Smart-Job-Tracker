import React from "react";
import Hero from "../components/Hero.jsx";
import Features from "../components/Features.jsx";
import Footer from "../components/Footer.jsx";

const LandingPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 font-sans">
      <Hero />
      <Features /> {/* Features component must render an element with id="features" */}
      <Footer />
    </div>
  );
};

export default LandingPage;
