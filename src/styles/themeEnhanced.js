/**
 * Enhanced Theme System for Award-Winning Portfolio
 * 
 * Features:
 * - Unique industrial color palette
 * - Mechanical-inspired gradients
 * - Advanced typography scale
 * - Consistent spacing system
 * - Shadow and depth tokens
 * - Animation presets
 */

export const theme = {
  // --- CORE COLOR PALETTE ---
  colors: {
    // Primary brand colors
    primary: {
      main: '#FF6B35', // Fiery Orange (mechanical heat)
      light: '#FF8C61',
      dark: '#E85A28',
      contrast: '#FFFFFF'
    },
    
    // Secondary accent colors
    secondary: {
      main: '#66FCF1', // Cyan (coolant/tech)
      light: '#8FFDF3',
      dark: '#4DCFC5',
      contrast: '#111111'
    },
    
    // Industrial palette
    industrial: {
      steel: '#B0B8C1', // Steel gray
      brass: '#D4A574', // Brass/bronze
      copper: '#B87333', // Copper
      iron: '#3D3D3D', // Cast iron
      chrome: '#E8E8E8', // Chrome finish
      oil: '#1A1A1A' // Machine oil black
    },
    
    // Neutral grays
    neutral: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      950: '#0A0A0A'
    },
    
    // Backgrounds
    background: {
      light: '#F9F9F9',
      lightAlt: '#EAEAEA',
      dark: '#050505',
      darkAlt: '#0F0F0F',
      paper: '#FFFFFF',
      paperDark: '#1A1A1A'
    },
    
    // Text colors
    text: {
      primary: '#111111',
      secondary: '#666666',
      disabled: '#CCCCCC',
      inverse: '#EAEAEA',
      inversSecondary: '#999999'
    },
    
    // Semantic colors
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
    
    // Special effects
    glow: {
      orange: 'rgba(255, 107, 53, 0.4)',
      cyan: 'rgba(102, 252, 241, 0.4)',
      white: 'rgba(255, 255, 255, 0.8)'
    }
  },

  // --- GRADIENTS ---
  gradients: {
    primary: 'linear-gradient(135deg, #FF6B35 0%, #E85A28 100%)',
    secondary: 'linear-gradient(135deg, #66FCF1 0%, #4DCFC5 100%)',
    industrial: 'linear-gradient(135deg, #B0B8C1 0%, #757575 100%)',
    
    // Holographic/iridescent
    holographic: 'linear-gradient(135deg, #FF6B35 0%, #66FCF1 25%, #FF6B35 50%, #66FCF1 75%, #FF6B35 100%)',
    
    // Background gradients
    lightBg: 'linear-gradient(180deg, #F9F9F9 0%, #E8E8E8 100%)',
    darkBg: 'linear-gradient(180deg, #050505 0%, #1A1A1A 100%)',
    
    // Mesh gradients (complex multi-color)
    meshLight: 'radial-gradient(at 0% 0%, rgba(255, 107, 53, 0.1) 0%, transparent 50%), radial-gradient(at 100% 100%, rgba(102, 252, 241, 0.1) 0%, transparent 50%)',
    meshDark: 'radial-gradient(at 0% 0%, rgba(255, 107, 53, 0.2) 0%, transparent 50%), radial-gradient(at 100% 100%, rgba(102, 252, 241, 0.2) 0%, transparent 50%)',
    
    // Glass morphism
    glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    glassDark: 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 100%)'
  },

  // --- TYPOGRAPHY ---
  typography: {
    fontFamily: {
      heading: "'Oswald', sans-serif",
      body: "'Inter', sans-serif",
      mono: "'JetBrains Mono', monospace"
    },
    
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
      '7xl': '4.5rem',  // 72px
      '8xl': '6rem',    // 96px
      '9xl': '8rem'     // 128px
    },
    
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    },
    
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2
    },
    
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'
    }
  },

  // --- SPACING SYSTEM (8px base grid) ---
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
    40: '10rem',    // 160px
    48: '12rem',    // 192px
    56: '14rem',    // 224px
    64: '16rem'     // 256px
  },

  // --- SHADOWS & DEPTH ---
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
    
    // Glow effects
    glowOrange: '0 0 20px rgba(255, 107, 53, 0.4), 0 0 40px rgba(255, 107, 53, 0.2)',
    glowCyan: '0 0 20px rgba(102, 252, 241, 0.4), 0 0 40px rgba(102, 252, 241, 0.2)',
    glowWhite: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.4)',
    
    // Mechanical depth
    mechanical: '0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.1)'
  },

  // --- BORDER RADIUS ---
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px'
  },

  // --- BREAKPOINTS ---
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  // --- Z-INDEX LAYERS ---
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    tooltip: 1600,
    cursor: 9999
  },

  // --- ANIMATION PRESETS ---
  animations: {
    // Easing functions
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    },
    
    // Duration tokens
    duration: {
      fastest: '100ms',
      faster: '200ms',
      fast: '300ms',
      normal: '400ms',
      slow: '600ms',
      slower: '800ms',
      slowest: '1000ms'
    },
    
    // Spring configs for Framer Motion
    spring: {
      smooth: { stiffness: 100, damping: 20, mass: 1 },
      snappy: { stiffness: 300, damping: 25, mass: 0.5 },
      bouncy: { stiffness: 500, damping: 15, mass: 0.8 },
      gentle: { stiffness: 60, damping: 24, mass: 1.2 }
    }
  },

  // --- EFFECTS ---
  effects: {
    // Backdrop blur for glass morphism
    backdropBlur: {
      sm: 'blur(4px)',
      base: 'blur(8px)',
      md: 'blur(12px)',
      lg: 'blur(16px)',
      xl: 'blur(24px)'
    },
    
    // Noise texture overlay
    noise: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
    
    // Scan line effect
    scanline: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05) 1px, transparent 1px, transparent 2px)'
  }
};

// --- UTILITY FUNCTIONS ---

/**
 * Get responsive font size
 */
export const responsiveFontSize = (min, max) => {
  return `clamp(${min}, ${((max - min) / 16)}vw + ${min}, ${max})`;
};

/**
 * Create gradient text
 */
export const gradientText = (gradient) => ({
  background: gradient,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
});

/**
 * Glass morphism effect
 */
export const glassMorphism = (blur = 'base', opacity = 0.1) => ({
  background: `rgba(255, 255, 255, ${opacity})`,
  backdropFilter: theme.effects.backdropBlur[blur],
  border: '1px solid rgba(255, 255, 255, 0.2)'
});

/**
 * Dark glass morphism
 */
export const darkGlassMorphism = (blur = 'base', opacity = 0.3) => ({
  background: `rgba(0, 0, 0, ${opacity})`,
  backdropFilter: theme.effects.backdropBlur[blur],
  border: '1px solid rgba(255, 255, 255, 0.1)'
});

export default theme;
