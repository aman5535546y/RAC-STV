import React from 'react';

export default function RotaryWheelIcon({ className = '', size = 26, color = '#FFFFFF' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={`rotary-wheel-icon ${className}`}
      fill={color}
      style={{ display: 'block' }}
    >
      {/* 24 Outer Gear Teeth */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360) / 24;
        const rad = (angle * Math.PI) / 180;
        const x1 = 50 + 37 * Math.cos(rad);
        const y1 = 50 + 37 * Math.sin(rad);
        const x2 = 50 + 45 * Math.cos(rad);
        const y2 = 50 + 45 * Math.sin(rad);
        return (
          <line 
            key={i} 
            x1={x1} 
            y1={y1} 
            x2={x2} 
            y2={y2} 
            stroke={color} 
            strokeWidth="4.5" 
            strokeLinecap="butt"
          />
        );
      })}

      {/* Outer Gear Ring */}
      <circle cx="50" cy="50" r="38" fill="none" stroke={color} strokeWidth="6" />

      {/* Inner Ring */}
      <circle cx="50" cy="50" r="28" fill="none" stroke={color} strokeWidth="5" />

      {/* 6 Spokes */}
      <g stroke={color} strokeWidth="5.5" strokeLinecap="round">
        <line x1="50" y1="50" x2="50" y2="18" />
        <line x1="50" y1="50" x2="77.7" y2="34" />
        <line x1="50" y1="50" x2="77.7" y2="66" />
        <line x1="50" y1="50" x2="50" y2="82" />
        <line x1="50" y1="50" x2="22.3" y2="66" />
        <line x1="50" y1="50" x2="22.3" y2="34" />
      </g>

      {/* Center Hub */}
      <circle cx="50" cy="50" r="10" fill={color} />
      <circle cx="50" cy="50" r="5" fill="rgba(18, 18, 22, 0.9)" />
      <rect x="48" y="42" width="4" height="5" fill="rgba(18, 18, 22, 0.9)" />
    </svg>
  );
}
