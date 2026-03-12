import React from 'react';

type FlagIconProps = {
  countryCode: string;
  className?: string;
};

export const FlagIcon = ({ countryCode, className = "w-5 h-4" }: FlagIconProps) => {
  switch (countryCode.toLowerCase()) {
    case 'tr':
      return (
        <svg viewBox="0 0 24 16" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="16" fill="#E30A17" rx="2"/>
          <circle cx="8" cy="8" r="4" fill="white"/>
          <circle cx="9.2" cy="8" r="3.2" fill="#E30A17"/>
          <path d="M12.5 8L10.5 8.7L11.2 10.5V5.5L10.5 7.3L12.5 8Z" fill="white"/>
        </svg>
      );
    case 'en':
      return (
        <svg viewBox="0 0 24 16" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="16" fill="#012169" rx="2"/>
          <path d="M0 0L24 16M24 0L0 16" stroke="white" strokeWidth="2.5"/>
          <path d="M0 0L24 16M24 0L0 16" stroke="#C8102E" strokeWidth="1.5"/>
          <path d="M12 0V16M0 8H24" stroke="white" strokeWidth="3.5"/>
          <path d="M12 0V16M0 8H24" stroke="#C8102E" strokeWidth="2.5"/>
        </svg>
      );
    case 'de':
      return (
        <svg viewBox="0 0 24 16" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="5.33" fill="black" rx="2" ry="0"/>
          <rect y="5.33" width="24" height="5.33" fill="#DD0000"/>
          <rect y="10.66" width="24" height="5.34" fill="#FFCE00" rx="0" ry="2"/>
        </svg>
      );
    case 'fr':
      return (
        <svg viewBox="0 0 24 16" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect width="8" height="16" fill="#002395" rx="2" ry="0"/>
          <rect x="8" width="8" height="16" fill="white"/>
          <rect x="16" width="8" height="16" fill="#ED2939" rx="0" ry="2"/>
        </svg>
      );
    default:
      return <span>🏳️</span>;
  }
};
