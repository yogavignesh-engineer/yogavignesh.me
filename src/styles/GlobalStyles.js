import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after { 
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html { 
    scroll-behavior: auto; 
    overscroll-behavior: none;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden !important;
    margin: 0;
    padding: 0;
    /* PERFORMANCE: Prevent layout shifts */
    text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }
  
  /* Hide Scrollbar Completely */
  ::-webkit-scrollbar { width: 0px; height: 0px; }
  ::-webkit-scrollbar-track { display: none; }
  ::-webkit-scrollbar-thumb { display: none; }
  
  /* For Firefox */
  * { scrollbar-width: none; }
  
  /* For IE and Edge */
  body { -ms-overflow-style: none; }

  body {
    margin: 0 !important;
    padding: 0 !important;
    background-color: #F9F9F9; 
    color: #111;
    font-family: 'Inter', sans-serif; 
    overflow-y: auto;
    overflow-x: hidden !important;
    width: 100% !important;
    max-width: 100% !important;
    min-height: 100vh;
    cursor: none; 
    /* Performance: Smooth Fonts */
    -webkit-font-smoothing: antialiased; 
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    position: relative;
  }
  
  /* === PERFORMANCE OPTIMIZATIONS === */
  
  /* GPU acceleration helper class */
  .gpu-accelerated {
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    perspective: 1000px;
    will-change: transform, opacity;
  }
  
  /* CSS Containment for layout isolation */
  .no-paint-layout {
    contain: layout paint style;
  }
  
  /* Optimized animations - prefer transform over layout properties */
  @media (prefers-reduced-motion: no-preference) {
    .animate-gpu {
      transform: translateZ(0);
      will-change: transform;
    }
  }
  
  /* Reduce motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  
  /* Image optimization defaults */
  img, video {
    max-width: 100%;
    height: auto;
    /* Prevent layout shift */
    content-visibility: auto;
  }
  
  /* Lazy loading hint */
  img[loading="lazy"] {
    /* Reserve space before load */
    background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  }
  
  #root {
    width: 100% !important;
    overflow-x: hidden !important;
    margin: 0 !important;
    padding: 0 !important;
    max-width: 100% !important;
    /* Containment for better performance */
    contain: layout style;
  }

  a { 
    color: #FF6B35; 
    text-decoration: none; 
    transition: color 0.2s ease;
    &:hover { color: #FF8C61; } 
  }
  
  *:focus-visible { 
    outline: 2px solid #FF6B35; 
    outline-offset: 4px; 
    border-radius: 2px; 
  }

  /* === WIREFRAME MODE (EASTER EGG) === */
  body.debug-mode * {
    color: #00ff00 !important;
    background: #000 !important;
    border: 1px solid #00ff00 !important;
    box-shadow: none !important;
    font-family: 'JetBrains Mono', monospace !important;
  }
  body.debug-mode img, body.debug-mode canvas {
    opacity: 0.2;
    filter: grayscale(100%) contrast(200%);
  }
`;
export default GlobalStyles;