// Award-Winning Design System - Mechanical Engineering Theme
// Signature Colors: Industrial Orange + Steel Blue + Technical Gray

export const theme = {
  // PRIMARY BRAND COLORS (Move away from generic cyan)
  colors: {
    // Hero Brand - Industrial Orange (stands out, engineering-focused)
    primary: '#FF6B35',        // Main orange
    primaryLight: '#FF8C61',   // Hover states
    primaryDark: '#E85A28',    // Active states
    
    // Secondary - Steel Blue (technical, professional)
    secondary: '#4A90E2',
    secondaryLight: '#6BA5E7',
    secondaryDark: '#357ABD',
    
    // Accent - Mechanical Yellow (CAD highlight color)
    accent: '#FFC107',
    accentLight: '#FFD54F',
    accentDark: '#FFA000',
    
    // Neutrals
    dark: '#050505',
    darkGray: '#1A1A1A',
    mediumGray: '#333333',
    lightGray: '#666666',
    light: '#EAEAEA',
    white: '#F9F9F9',
    
    // Technical UI
    success: '#4CAF50',   // Operational
    warning: '#FF9800',   // In Progress
    error: '#F44336',     // Error State
    info: '#2196F3',      // Info
    
    // Blueprint Theme
    blueprintBg: '#0A1628',      // Dark blue background
    blueprintLine: '#1E3A5F',    // Grid lines
    blueprintHighlight: '#64B5F6', // Highlight color
  },
  
  // TYPOGRAPHY
  fonts: {
    heading: "'Oswald', sans-serif",          // Bold, condensed
    body: "'Inter', sans-serif",              // Clean, readable
    mono: "'JetBrains Mono', monospace",     // Technical
    display: "'Rajdhani', sans-serif",       // Optional: More mechanical feel
  },
  
  // SPACING (8px base grid for precision)
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '1rem',     // 16px
    md: '1.5rem',   // 24px
    lg: '2rem',     // 32px
    xl: '3rem',     // 48px
    xxl: '4rem',    // 64px
    xxxl: '6rem',   // 96px
  },
  
  // ANIMATION
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.6s ease',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // BREAKPOINTS
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1440px',
    wide: '1920px',
  },
  
  // BLUEPRINT TEXTURES
  textures: {
    grid: `
      background-image: 
        linear-gradient(rgba(255, 107, 53, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 107, 53, 0.05) 1px, transparent 1px);
      background-size: 40px 40px;
    `,
    dots: `
      background-image: radial-gradient(circle, rgba(255, 107, 53, 0.1) 1px, transparent 1px);
      background-size: 20px 20px;
    `,
    blueprint: `
      background-color: #0A1628;
      background-image: 
        linear-gradient(rgba(30, 58, 95, 0.5) 2px, transparent 2px),
        linear-gradient(90deg, rgba(30, 58, 95, 0.5) 2px, transparent 2px),
        linear-gradient(rgba(30, 58, 95, 0.3) 1px, transparent 1px),
        linear-gradient(90deg, rgba(30, 58, 95, 0.3) 1px, transparent 1px);
      background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
    `,
  },
  
  // SHADOWS (Technical depth)
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 8px rgba(0,0,0,0.2)',
    lg: '0 8px 16px rgba(0,0,0,0.3)',
    xl: '0 16px 32px rgba(0,0,0,0.4)',
    glow: '0 0 20px rgba(255, 107, 53, 0.3)',
    glowBlue: '0 0 20px rgba(74, 144, 226, 0.3)',
  },
};
