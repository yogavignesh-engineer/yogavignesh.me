import React, { useRef, useState, useEffect, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// Piston chamber animation
const pistonPulse = keyframes`
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.05); }
`;

// Container
const ProgressContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: ${props => props.$maxWidth || '600px'};
  height: ${props => props.$height || '60px'};
  margin: ${props => props.$margin || '0'};
`;

// Outer housing (industrial casing)
const PistonHousing = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #1A1A1A 0%, #0D0D0D 100%);
  border: 2px solid #333;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 
    inset 0 2px 4px rgba(0, 0, 0, 0.5),
    0 4px 8px rgba(0, 0, 0, 0.3);
  
  /* Metallic ridges */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: repeating-linear-gradient(
      90deg,
      transparent,
      transparent 10px,
      rgba(255, 255, 255, 0.02) 10px,
      rgba(255, 255, 255, 0.02) 11px
    );
    pointer-events: none;
  }
`;

// Animated hydraulic fluid
const HydraulicFluid = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, 
    #E85A28 0%,
    #FF6B35 50%,
    #FF8C61 100%
  );
  border-radius: 6px;
  box-shadow: 
    0 0 20px rgba(255, 107, 53, 0.6),
    0 0 40px rgba(255, 107, 53, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    inset 0 -2px 4px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease;
  animation: pulse 2s ease-in-out infinite;
  
  &:hover {
    box-shadow: 
      0 0 30px rgba(255, 107, 53, 0.8),
      0 0 60px rgba(255, 107, 53, 0.4),
      inset 0 2px 6px rgba(255, 255, 255, 0.4);
  }
  
  /* Liquid shimmer effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.5),
      transparent
    );
    animation: shimmer 2.5s ease-in-out infinite;
  }
  
  /* Bubbles effect */
  &::before {
    content: '';
    position: absolute;
    top: 10%;
    left: 20%;
    width: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    animation: bubble 3s ease-in-out infinite;
    box-shadow: 
      20px 10px 0 rgba(255, 255, 255, 0.4),
      40px 5px 0 rgba(255, 255, 255, 0.5),
      60px 15px 0 rgba(255, 255, 255, 0.3);
  }
  
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 200%; }
  }
  
  @keyframes pulse {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.1); }
  }
  
  @keyframes bubble {
    0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
    50% { transform: translateY(-5px) scale(1.2); opacity: 0.9; }
  }
`;

// Pressure gauge marks
const PressureMarks = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  pointer-events: none;
  z-index: 2;
  
  span {
    width: 2px;
    height: ${props => props.$markHeight || '40%'};
    background: rgba(255, 255, 255, 0.1);
    
    &:nth-child(5n) {
      height: ${props => props.$majorMarkHeight || '60%'};
      background: rgba(255, 107, 53, 0.3);
    }
  }
`;

// Percentage label
const ProgressLabel = styled(motion.div)`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  font-weight: bold;
  color: #EAEAEA;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &::before {
    content: '◆';
    color: #FF6B35;
    font-size: 0.6rem;
  }
`;

// Status LED
const StatusLED = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  background: ${props => props.$active ? '#4CAF50' : '#333'};
  border-radius: 50%;
  box-shadow: ${props => props.$active ? '0 0 12px #4CAF50' : 'none'};
  z-index: 3;
  
  animation: ${props => props.$active ? pistonPulse : 'none'} 2s ease-in-out infinite;
`;

// Label above progress bar
const BarLabel = styled.div`
  position: absolute;
  top: -24px;
  left: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

/**
 * PistonProgressBar Component
 * Industrial hydraulic-style progress indicator
 * 
 * Props:
 * - progress: 0-100 (number)
 * - label: string (optional)
 * - showPercentage: boolean (default: true)
 * - showLED: boolean (default: true)
 * - showMarks: boolean (default: true)
 * - height: string (default: '60px')
 * - maxWidth: string (default: '600px')
 * - animated: boolean (default: true)
 */
const PistonProgressBar = ({
  progress = 0,
  label = '',
  showPercentage = true,
  showLED = true,
  showMarks = true,
  height = '60px',
  maxWidth = '600px',
  margin = '0',
  animated = true,
  className,
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      // Animate progress change
      const duration = 1000; // 1 second
      const steps = 60;
      const increment = (progress - displayProgress) / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        setDisplayProgress(prev => {
          const newValue = prev + increment;
          if (currentStep >= steps) {
            clearInterval(timer);
            return progress;
          }
          return newValue;
        });
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, animated]);

  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, displayProgress));

  return (
    <ProgressContainer $height={height} $maxWidth={maxWidth} $margin={margin} className={className}>
      {label && <BarLabel>{label}</BarLabel>}

      <PistonHousing
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={label || "System progress indicator"}
      >
        {/* Pressure marks */}
        {showMarks && (
          <PressureMarks $markHeight="40%" $majorMarkHeight="60%">
            {Array.from({ length: 20 }, (_, i) => (
              <span key={i} />
            ))}
          </PressureMarks>
        )}

        {/* Hydraulic fluid fill */}
        <HydraulicFluid
          initial={{ width: '0%' }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{
            type: 'spring',
            stiffness: 40,
            damping: 20,
            mass: 0.3,
            restSpeed: 0.01
          }}
        />

        {/* Status LED */}
        {showLED && (
          <StatusLED
            $active={clampedProgress > 0}
            animate={clampedProgress > 0 ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Percentage display */}
        {showPercentage && (
          <ProgressLabel
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {Math.round(clampedProgress)}%
          </ProgressLabel>
        )}
      </PistonHousing>
    </ProgressContainer>
  );
};

export default PistonProgressBar;
