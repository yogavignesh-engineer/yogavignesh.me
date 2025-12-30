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
  
  /* --- PERFORMANCE HELPERS --- */
  .gpu-accelerated {
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
    will-change: transform, opacity;
  }
  
  .no-paint-layout {
    contain: layout paint style;
  }
  
  #root {
    width: 100% !important;
    overflow-x: hidden !important;
    margin: 0 !important;
    padding: 0 !important;
    max-width: 100% !important;
  }

  a { color: #FF6B35; text-decoration: none; transition: color 0.3s ease; &:hover { color: #FF8C61; } }
  *:focus-visible { outline: 2px solid #FF6B35; outline-offset: 4px; border-radius: 2px; }

  /* --- WIREFRAME MODE (EASTER EGG) --- */
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