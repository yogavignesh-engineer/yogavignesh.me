import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// Animated scanning line effect
const scan = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
`;

const BlueprintContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
`;

// Main blueprint grid
const BlueprintGrid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${props => props.$intensity || 0.3};
  
  /* Major grid lines */
  background-image: 
    linear-gradient(${props => props.$color || 'rgba(255, 107, 53, 0.15)'} 2px, transparent 2px),
    linear-gradient(90deg, ${props => props.$color || 'rgba(255, 107, 53, 0.15)'} 2px, transparent 2px),
    /* Minor grid lines */
    linear-gradient(${props => props.$color || 'rgba(255, 107, 53, 0.08)'} 1px, transparent 1px),
    linear-gradient(90deg, ${props => props.$color || 'rgba(255, 107, 53, 0.08)'} 1px, transparent 1px);
  
  background-size: 
    100px 100px,
    100px 100px,
    20px 20px,
    20px 20px;
  
  background-position: -1px -1px;
`;

// Corner measurement indicators
const CornerMarker = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  ${props => props.$position};
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    background: ${props => props.$color || '#FF6B35'};
  }
  
  &::before {
    width: 2px;
    height: 100%;
    ${props => props.$isLeft ? 'left: 0;' : 'right: 0;'}
  }
  
  &::after {
    width: 100%;
    height: 2px;
    ${props => props.$isTop ? 'top: 0;' : 'bottom: 0;'}
  }
`;

// Dimension callout lines
const DimensionLine = styled(motion.div)`
  position: absolute;
  ${props => props.$position};
  background: ${props => props.$color || '#FF6B35'};
  opacity: 0.4;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    border: 2px solid ${props => props.$color || '#FF6B35'};
    border-radius: 50%;
    background: transparent;
  }
  
  &::before { left: -4px; top: 50%; transform: translateY(-50%); }
  &::after { right: -4px; top: 50%; transform: translateY(-50%); }
`;

// Technical annotation
const TechAnnotation = styled(motion.div)`
  position: absolute;
  ${props => props.$position};
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: ${props => props.$color || '#FF6B35'};
  letter-spacing: 1px;
  opacity: 0.6;
  
  &::before {
    content: '◆';
    margin-right: 5px;
    font-size: 0.5rem;
  }
`;

// Scanning line effect
const ScanLine = styled.div`
  position: absolute;
  top: -100%;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    ${props => props.$color || '#FF6B35'} 50%,
    transparent
  );
  box-shadow: 0 0 10px ${props => props.$color || '#FF6B35'};
  animation: ${scan} ${props => props.$duration || 8}s linear infinite;
  animation-delay: ${props => props.$delay || 0}s;
`;

// Radial measurement grid
const RadialGrid = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 600px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  opacity: 0.1;
  
  /* Concentric circles */
  background-image: 
    radial-gradient(circle, transparent 0%, transparent 49%, ${props => props.$color || '#FF6B35'} 49%, ${props => props.$color || '#FF6B35'} 50%, transparent 50%),
    radial-gradient(circle, transparent 0%, transparent 69%, ${props => props.$color || '#FF6B35'} 69%, ${props => props.$color || '#FF6B35'} 70%, transparent 70%),
    radial-gradient(circle, transparent 0%, transparent 89%, ${props => props.$color || '#FF6B35'} 89%, ${props => props.$color || '#FF6B35'} 90%, transparent 90%);
  background-size: 200px 200px, 400px 400px, 600px 600px;
  background-position: center;
  background-repeat: no-repeat;
`;

/**
 * BlueprintOverlay Component
 * Adds technical drawing aesthetics to any section
 * 
 * Props:
 * - variant: 'light' | 'dark' | 'blueprint' (default: 'light')
 * - intensity: 0-1 (default: 0.3)
 * - showCorners: boolean (default: true)
 * - showAnnotations: boolean (default: true)
 * - showScanLine: boolean (default: false)
 * - showRadial: boolean (default: false)
 */
const BlueprintOverlay = ({ 
  variant = 'light', 
  intensity = 0.3,
  showCorners = true,
  showAnnotations = true,
  showScanLine = false,
  showRadial = false,
  color = null,
}) => {
  // Color based on variant
  const getColor = () => {
    if (color) return color;
    switch (variant) {
      case 'dark': return 'rgba(255, 255, 255, 0.15)';
      case 'blueprint': return 'rgba(100, 181, 246, 0.3)';
      default: return 'rgba(255, 107, 53, 0.15)';
    }
  };
  
  const overlayColor = getColor();
  const solidColor = variant === 'dark' ? '#EAEAEA' : 
                     variant === 'blueprint' ? '#64B5F6' : '#FF6B35';

  return (
    <BlueprintContainer>
      {/* Main grid */}
      <BlueprintGrid $color={overlayColor} $intensity={intensity} />
      
      {/* Corner markers */}
      {showCorners && (
        <>
          <CornerMarker 
            $position="top: 20px; left: 20px;" 
            $isTop $isLeft 
            $color={solidColor}
          />
          <CornerMarker 
            $position="top: 20px; right: 20px;" 
            $isTop 
            $color={solidColor}
          />
          <CornerMarker 
            $position="bottom: 20px; left: 20px;" 
            $isLeft 
            $color={solidColor}
          />
          <CornerMarker 
            $position="bottom: 20px; right: 20px;" 
            $color={solidColor}
          />
        </>
      )}
      
      {/* Technical annotations */}
      {showAnnotations && (
        <>
          <TechAnnotation 
            $position="top: 40px; left: 90px;"
            $color={solidColor}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 0.6, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            SECTION_VIEW
          </TechAnnotation>
          
          <TechAnnotation 
            $position="top: 40px; right: 90px;"
            $color={solidColor}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.6, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            REV_2025
          </TechAnnotation>
        </>
      )}
      
      {/* Dimension lines */}
      <DimensionLine 
        $position="top: 50%; left: 5%; width: 2px; height: 100px;"
        $color={solidColor}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      />
      
      {/* Scanning line */}
      {showScanLine && (
        <>
          <ScanLine $color={solidColor} $duration={8} $delay={0} />
          <ScanLine $color={solidColor} $duration={12} $delay={3} />
        </>
      )}
      
      {/* Radial grid overlay */}
      {showRadial && <RadialGrid $color={solidColor} />}
    </BlueprintContainer>
  );
};

export default React.memo(BlueprintOverlay);
