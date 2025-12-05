import React from 'react';

export const DefaultLogo = () => (
  <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-navy-900">
    {/* Candle Body */}
    <rect x="40" y="30" width="20" height="40" rx="2" stroke="currentColor" strokeWidth="3" fill="none" />
    {/* Wick Top */}
    <line x1="50" y1="30" x2="50" y2="15" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    {/* Wick Bottom */}
    <line x1="50" y1="70" x2="50" y2="85" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    
    {/* Flame */}
    <path d="M50 2 C50 2 42 10 42 14 C42 18 46 20 50 20 C54 20 58 18 58 14 C58 10 50 2 50 2Z" fill="#D4AF37" />
    
    {/* Chart Line Graph ZigZag - overlaying somewhat */}
    <path d="M10 60 L 30 75 L 45 55 L 65 65 L 90 35" stroke="#D4AF37" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);