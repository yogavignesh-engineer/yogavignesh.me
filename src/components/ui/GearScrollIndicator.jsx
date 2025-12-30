import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// Gear rotation animation
const rotateGear = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Container
const ScrollIndicatorContainer = styled(motion.div)`
  position: fixed;
  ${props => props.position || 'bottom: 40px; right: 40px;'}
  z-index: ${props => props.zIndex || 100};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
  
  @media (max-width: 768px) {
    ${props => props.mobilePosition || 'bottom: 20px; right: 20px;'}
    transform: scale(0.8);
  }
`;

// Outer gear housing
const GearHousing = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Outer ring */
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border: 2px solid #333;
    border-radius: 50%;
    box-shadow: 
      inset 0 0 10px rgba(0, 0, 0, 0.5),
      0 0 15px rgba(255, 107, 53, 0.2);
  }
`;

// Animated gear SVG
const GearSVG = styled.svg`
  width: 50px;
  height: 50px;
  animation: ${rotateGear} ${props => props.speed || 4}s linear infinite;
  filter: drop-shadow(0 0 5px rgba(255, 107, 53, 0.3));
`;

// Inner circle showing progress
const ProgressCircle = styled.circle`
  fill: none;
  stroke: #FF6B35;
  stroke-width: 3;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: center;
  transition: stroke-dashoffset 0.3s ease;
  filter: drop-shadow(0 0 8px rgba(255, 107, 53, 0.5));
`;

// Center indicator
const CenterDot = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  background: #FF6B35;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 107, 53, 0.8);
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 6px;
    height: 6px;
    background: #FFC107;
    border-radius: 50%;
  }
`;

// Label text
const ScrollLabel = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  
  span {
    display: block;
    color: #FF6B35;
    font-size: 0.75rem;
    font-weight: bold;
    margin-top: 2px;
  }
`;

/**
 * GearScrollIndicator Component
 * Rotating gear that shows scroll progress
 * 
 * Props:
 * - scrollProgress: 0-100 (number)
 * - position: CSS position string (e.g., 'bottom: 40px; right: 40px;')
 * - mobilePosition: CSS position for mobile
 * - showLabel: boolean (default: true)
 * - showProgress: boolean (default: true)
 * - rotationSpeed: number in seconds (default: 4)
 * - size: 'small' | 'medium' | 'large' (default: 'medium')
 */
const GearScrollIndicator = ({
  scrollProgress = 0,
  position,
  mobilePosition,
  showLabel = true,
  showProgress = true,
  rotationSpeed = 4,
  size = 'medium',
  className,
}) => {
  // Size configurations
  const sizes = {
    small: { container: 50, gear: 40, stroke: 2 },
    medium: { container: 60, gear: 50, stroke: 3 },
    large: { container: 80, gear: 70, stroke: 4 },
  };
  
  const config = sizes[size] || sizes.medium;
  const radius = (config.gear - config.stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (scrollProgress / 100) * circumference;
  
  return (
    <ScrollIndicatorContainer
      position={position}
      mobilePosition={mobilePosition}
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5, type: 'spring' }}
    >
      <GearHousing>
        {/* Gear teeth */}
        <GearSVG 
          viewBox="0 0 100 100" 
          speed={rotationSpeed}
        >
          {/* Gear shape */}
          <path
            d="M50,10 L54,10 L54,5 L60,5 L60,10 L64,10 L67,13 L72,13 L72,7 L77,7 L77,13 L80,16 L80,20 L85,20 L85,26 L80,26 L80,30 L77,33 L77,38 L83,38 L83,44 L77,44 L77,47 L80,50 L80,54 L85,54 L85,60 L80,60 L80,64 L77,67 L77,72 L83,72 L83,77 L77,77 L77,80 L74,80 L70,83 L70,90 L64,90 L64,83 L60,83 L60,90 L54,90 L54,83 L50,83 L47,80 L43,80 L43,87 L37,87 L37,80 L33,77 L30,77 L30,83 L24,83 L24,77 L20,74 L20,70 L15,70 L15,64 L20,64 L20,60 L15,60 L15,54 L20,54 L20,50 L23,47 L23,43 L17,43 L17,37 L23,37 L23,33 L20,30 L20,26 L15,26 L15,20 L20,20 L20,16 L23,13 L28,13 L28,7 L33,7 L33,13 L37,16 L40,16 L40,10 L46,10 Z"
            fill="#FF6B35"
            opacity="0.3"
          />
          
          {/* Progress circle */}
          {showProgress && (
            <>
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="#333"
                strokeWidth={config.stroke}
              />
              <ProgressCircle
                cx="50"
                cy="50"
                r={radius}
                strokeWidth={config.stroke}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </>
          )}
        </GearSVG>
        
        <CenterDot />
      </GearHousing>
      
      {showLabel && (
        <ScrollLabel>
          Scroll
          <span>{Math.round(scrollProgress)}%</span>
        </ScrollLabel>
      )}
    </ScrollIndicatorContainer>
  );
};

export default GearScrollIndicator;
