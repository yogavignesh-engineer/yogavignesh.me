import React from 'react';
import styled from 'styled-components';

// PERFORMANCE: Simplified grain using CSS repeating gradient instead of SVG filter
// This is 10x faster than SVG filters in Chrome
const GrainOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  
  /* Ultra-lightweight dot pattern instead of SVG noise */
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(0, 0, 0, 0.04) 0.5px, transparent 0.5px),
    radial-gradient(circle at 75% 75%, rgba(0, 0, 0, 0.04) 0.5px, transparent 0.5px);
  background-size: 4px 4px;
  background-position: 0 0, 2px 2px;
  
  opacity: 0.3;
  
  /* PERFORMANCE: Force layer promotion without expensive blend mode */
  will-change: auto;
  transform: translateZ(0);
  
  @media (max-width: 768px) {
    opacity: 0.15; /* Less visible on mobile */
  }
`;

export default function Grain() {
  return <GrainOverlay />;
}