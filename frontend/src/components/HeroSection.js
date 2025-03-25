import React from "react";
import AuthPage from "./AuthPage";

const HeroSection = () => {
  return (
    <div className="relative w-full h-screen bg-gray-950 text-cyan-300 flex">

      {/* Left Section - Hero Text */}
      <div className="w-1/2 flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          Crime Management & FIR Tracking
        </h1>
        <h2 className="text-lg md:text-xl italic text-gray-300 m-6 p-4 bg-white/10 backdrop-blur-md rounded-lg px-6 py-2 border border-cyan-400 shadow-lg">
          For the betterment of Law & Order in the Country
        </h2>
      </div>

      {/* Right Section - Hero Image with Centered Login Form */}
      <div className="w-1/2 relative flex justify-center items-center">
        
        {/* Background Image */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/HeroImage.jpg')" }}
        ></div>

        {/* Login Form Positioned at the Exact Center */}
        <div className="relative flex flex-col items-center justify-center w-full">
          <AuthPage />
        </div>

      </div>

    </div>
  );
};

export default HeroSection;
