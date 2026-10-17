import React from 'react';
import siteBackgroundImg from '../assets/background.jpg';

export const SiteBackground = () => {
  return (
    <div 
      className="dwt-site-bg-layer"
      style={{
        backgroundImage: `linear-gradient(rgba(6, 7, 10, 0.65), rgba(6, 7, 10, 0.82)), url('${siteBackgroundImg}')`
      }}
    />
  );
};

export const RandomBackground = SiteBackground;
export default SiteBackground;

