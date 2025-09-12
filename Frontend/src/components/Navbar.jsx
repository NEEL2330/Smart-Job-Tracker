import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleFeatures = (e) => {
    e.preventDefault();

    // If already on home, just scroll
    if (location.pathname === "/") {
      const el = document.getElementById("features");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // If not on home, navigate to home then try to scroll after a short delay
    navigate("/");
    setTimeout(() => {
      const el = document.getElementById("features");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80); // small delay to allow LandingPage to mount
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md sticky top-0 z-50">
      {/* Logo: always navigates to home */}
      <Link to="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-700">
        SmartJobTracker
      </Link>

      {/* Links */}
      <div className="flex items-center space-x-6">
        <a href="#features" onClick={handleFeatures} className="text-gray-700 hover:text-indigo-600">
          Features
        </a>
        <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">
          Dashboard
        </Link>
        <Link to="/signin" className="text-gray-700 hover:text-indigo-600">
          Sign In
        </Link>
      </div>
    </nav>
  );
}
