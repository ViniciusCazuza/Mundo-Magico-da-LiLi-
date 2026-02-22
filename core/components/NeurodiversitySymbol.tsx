import React from 'react';

interface NeurodiversitySymbolProps {
  size?: number;
  opacity?: number;
  className?: string;
}

export const NeurodiversitySymbol: React.FC<NeurodiversitySymbolProps> = ({ 
  size = 40, 
  opacity = 1,
  className = '' 
}) => {
  return (
    <svg 
      width={size} 
      height={size / 2} 
      viewBox="0 0 100 50" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      {/* Left loop of infinity */}
      <path 
        d="M 25 25 C 25 15, 15 10, 10 15 C 5 20, 5 30, 10 35 C 15 40, 25 35, 25 25" 
        fill="none" 
        stroke="url(#gradient1)" 
        strokeWidth="6" 
        strokeLinecap="round"
      />
      
      {/* Right loop of infinity */}
      <path 
        d="M 25 25 C 25 35, 35 40, 40 35 C 45 30, 45 20, 40 15 C 35 10, 25 15, 25 25" 
        fill="none" 
        stroke="url(#gradient2)" 
        strokeWidth="6" 
        strokeLinecap="round"
        transform="translate(50, 0)"
      />
      
      {/* Gradient definitions with soft pastel rainbow colors */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#FFB6C1', stopOpacity: 1 }} />
          <stop offset="33%" style={{ stopColor: '#ADD8E6', stopOpacity: 1 }} />
          <stop offset="66%" style={{ stopColor: '#98FF98', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#FFFFE0', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#E6E6FA', stopOpacity: 1 }} />
          <stop offset="33%" style={{ stopColor: '#FFDAB9', stopOpacity: 1 }} />
          <stop offset="66%" style={{ stopColor: '#B2AC88', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#DDA0DD', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  );
};
