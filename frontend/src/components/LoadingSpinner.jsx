import React from "react";
import logo from "../assets/logo.png"; // Make sure this path is correct!

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-white">
      {/* Logo */}
      <img src={logo} alt="Logo" className="w-24 h-24 mb-6 animate-pulse" />

      {/* Spinner */}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
        </div>
      </div>

      {/* Loading Text */}
      <p className="mt-6 text-gray-700 text-lg font-semibold animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;
