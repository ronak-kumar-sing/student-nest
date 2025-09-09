import React from 'react';

const ShinyText = ({ text, className = "" }) => {
  return (
    <span
      className={`bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-clip-text text-transparent animate-pulse ${className}`}
      style={{
        backgroundSize: '200% auto',
        animation: 'shimmer 2s linear infinite'
      }}
    >
      {text}
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </span>
  );
};

export default ShinyText;
