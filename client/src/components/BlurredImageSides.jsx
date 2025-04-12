import React from "react";

const ImageWithSideGradient = ({ image }) => {
  const gradientColor = "#1a1a1a"; // lighter black shade

  return (
    <div
      className="relative w-full max-w-6xl mx-auto overflow-hidden"
      style={{ backgroundColor: gradientColor }}
    >
      {/* Main Image */}
      <img
        src={image}
        alt="Backdrop"
        className="h-[60vh] w-full object-cover"
      />

      {/* Left Side Gradient */}
      <div
        className="absolute top-0 left-0 h-full w-1/5 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(to right, ${gradientColor}, transparent)`,
        }}
      />

      {/* Right Side Gradient */}
      <div
        className="absolute top-0 right-0 h-full w-1/5 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(to left, ${gradientColor}, transparent)`,
        }}
      />
    </div>
  );
};

export default ImageWithSideGradient;
