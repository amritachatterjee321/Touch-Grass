import React from 'react';

interface FloppyDiskIconProps {
  className?: string;
  filled?: boolean;
}

export const FloppyDiskIcon: React.FC<FloppyDiskIconProps> = ({ className = '', filled = false }) => {
  return (
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 20 20" 
      className={`pixel-perfect ${className}`}
      style={{ imageRendering: 'pixelated' }}
    >
      {/* Floppy disk body */}
      <rect 
        x="2" 
        y="2" 
        width="16" 
        height="16" 
        fill={filled ? '#ff6347' : '#4682b4'}
        stroke="#2d2d2d" 
        strokeWidth="1"
      />
      
      {/* Metal slider */}
      <rect 
        x="4" 
        y="4" 
        width="12" 
        height="3" 
        fill="#696969"
        stroke="#2d2d2d" 
        strokeWidth="1"
      />
      
      {/* Label area */}
      <rect 
        x="5" 
        y="9" 
        width="10" 
        height="6" 
        fill={filled ? '#ffffff' : '#f0f8ff'}
        stroke="#2d2d2d" 
        strokeWidth="1"
      />
      
      {/* Write protect notch */}
      <rect 
        x="2" 
        y="8" 
        width="2" 
        height="2" 
        fill="#2d2d2d"
      />
      
      {/* Center hole */}
      <circle 
        cx="10" 
        cy="12" 
        r="1" 
        fill="#2d2d2d"
      />
    </svg>
  );
};