import React from "react";

const Hero = () => {
  return (
    <header className="bg-white">
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Land Your Dream Job</span>
          <span className="block text-indigo-600">Faster and Smarter.</span>
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
          Stop juggling spreadsheets. SmartJobTracker organizes your job search, tracks
          applications, and helps you succeed.
        </p>
        <div className="mt-8 flex justify-center">
          <a
            href="/signup"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Get Started for Free
          </a>
        </div>
      </div>
    </header>
  );
};

export default Hero;
