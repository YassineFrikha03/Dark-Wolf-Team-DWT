const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svgContent = `
<svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080a0f" />
      <stop offset="50%" stop-color="#121622" />
      <stop offset="100%" stop-color="#050608" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffe600" />
      <stop offset="100%" stop-color="#ff9900" />
    </linearGradient>
    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff1a27" />
      <stop offset="100%" stop-color="#b8000b" />
    </linearGradient>
  </defs>

  <!-- Background Card -->
  <rect width="600" height="600" rx="24" fill="url(#bgGrad)" stroke="#ff9900" stroke-width="4" />

  <!-- Cyber Grid Lines -->
  <path d="M 0,150 L 600,150 M 0,300 L 600,300 M 0,450 L 600,450" stroke="rgba(255,255,255,0.05)" stroke-width="2" />
  <path d="M 150,0 L 150,600 M 300,0 L 300,600 M 450,0 L 450,600" stroke="rgba(255,255,255,0.05)" stroke-width="2" />

  <!-- Corner cyber accents -->
  <polygon points="20,20 60,20 20,60" fill="#e10613" />
  <polygon points="580,20 540,20 580,60" fill="#ff9900" />
  <polygon points="20,580 60,580 20,540" fill="#ff9900" />
  <polygon points="580,580 540,580 580,540" fill="#e10613" />

  <!-- Header -->
  <text x="300" y="80" text-anchor="middle" font-family="'Orbitron', Arial Black, sans-serif" font-size="28" font-weight="900" fill="#ffffff" letter-spacing="4">
    DUBBY <tspan fill="#e10613">×</tspan> DARK WOLF
  </text>
  <text x="300" y="110" text-anchor="middle" font-family="'Orbitron', Arial, sans-serif" font-size="14" font-weight="700" fill="#ff9900" letter-spacing="3">
    PARTENAIRE ÉNERGIE OFFICIEL
  </text>

  <!-- Energy Tub Icon Center Left -->
  <g transform="translate(110, 170)">
    <!-- Tub body -->
    <rect x="0" y="40" width="150" height="180" rx="16" fill="#181c26" stroke="#ffe600" stroke-width="4" />
    <!-- Tub lid -->
    <rect x="-10" y="20" width="170" height="30" rx="8" fill="#ff9900" />
    <!-- Tub label -->
    <rect x="15" y="80" width="120" height="90" rx="8" fill="#0b0e14" />
    <text x="75" y="125" text-anchor="middle" font-family="Arial Black" font-size="22" font-weight="900" fill="#ffe600">DUBBY</text>
    <text x="75" y="150" text-anchor="middle" font-family="Arial" font-size="11" font-weight="700" fill="#ffffff">ENERGY LAB</text>
    <circle cx="75" cy="190" r="10" fill="#e10613" />
  </g>

  <!-- Center-Right Badge: USE CODE DWT 10% OFF -->
  <g transform="translate(320, 210)">
    <rect x="0" y="0" width="220" height="150" rx="12" fill="rgba(255, 153, 0, 0.12)" stroke="#ff9900" stroke-width="3" stroke-dasharray="8 4" />
    <text x="110" y="38" text-anchor="middle" font-family="'Orbitron', Arial, sans-serif" font-size="14" font-weight="800" fill="#ffffff">
      // USE CODE //
    </text>
    <text x="110" y="85" text-anchor="middle" font-family="'Orbitron', Arial Black, sans-serif" font-size="38" font-weight="900" fill="url(#goldGrad)" letter-spacing="3">
      DWT
    </text>
    <text x="110" y="125" text-anchor="middle" font-family="'Orbitron', Arial, sans-serif" font-size="20" font-weight="900" fill="#ffffff">
      10% OFF
    </text>
  </g>

  <!-- Slogan Bar Bottom -->
  <rect x="40" y="440" width="520" height="50" rx="8" fill="rgba(225, 6, 19, 0.18)" stroke="#e10613" stroke-width="1.5" />
  <text x="300" y="472" text-anchor="middle" font-family="'Orbitron', Arial, sans-serif" font-size="15" font-weight="800" fill="#ffffff" letter-spacing="2">
    BETTER FOCUS · CLEAN ENERGY · VICTORY
  </text>

  <text x="300" y="530" text-anchor="middle" font-family="'Orbitron', Arial Black, sans-serif" font-size="13" font-weight="900" fill="#9aa1ad" letter-spacing="3">
    ON NE JOUE PAS. ON DOMINE.
  </text>
</svg>
`;

const outputPath = path.resolve(__dirname, '../public/dubby_dwt_sponsor.png');
sharp(Buffer.from(svgContent))
  .png()
  .toFile(outputPath)
  .then(() => {
    console.log('Successfully generated:', outputPath);
  })
  .catch(err => {
    console.error('Error generating asset:', err);
  });
