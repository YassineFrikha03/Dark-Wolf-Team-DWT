import React from 'react';

// Logo Officiel Dark Wolf Team importé directement depuis l'image fournie par le client
export const WolfLogo = ({ size = 48, className = "", style = {} }) => (
  <img 
    src="/logo-dwt.png" 
    alt="Dark Wolf Team Logo"
    width={size}
    height={size}
    className={`dwt-wolf-logo-img ${className}`}
    style={{
      width: `${size}px`,
      height: `${size}px`,
      objectFit: 'contain',
      display: 'inline-block',
      verticalAlign: 'middle',
      filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.45))',
      ...style
    }}
  />
);

export const BrandTitle = ({ withTag = false, size = 52 }) => (
  <div className="brand-logo-container">
    <div style={{ width: `${size}px`, height: `${size}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <WolfLogo size={size} className="brand-wolf-icon" style={{ transform: 'scale(1.22)' }} />
    </div>
    <div className="brand-text">
      <span className="brand-dark">DARK WOLF</span>
      <span className="brand-team">TEAM</span>
    </div>
  </div>
);

export default WolfLogo;
