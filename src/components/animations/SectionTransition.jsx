import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useInView } from 'framer-motion';

// Container for transition effect
const TransitionContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  height: ${props => props.height || '200px'};
  overflow: hidden;
  background: ${props => props.background || 'transparent'};
`;

// Isometric grid layer
const IsometricGrid = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${props => props.opacity || 0.15};
`;

// Animated scan line
const ScanLine = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    ${props => props.color || '#FF6B35'} 50%,
    transparent
  );
  box-shadow: 0 0 20px ${props => props.color || '#FF6B35'};
`;

// Technical callout label
const TechnicalCallout = styled(motion.div)`
  position: absolute;
  ${props => props.position};
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: ${props => props.color || '#FF6B35'};
  letter-spacing: 1px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '';
    width: 30px;
    height: 1px;
    background: ${props => props.color || '#FF6B35'};
  }
  
  &::after {
    content: '◆';
    font-size: 0.5rem;
  }
`;

/**
 * SectionTransition Component
 * Blueprint-style section divider with isometric grid
 * 
 * Props:
 * - variant: 'light' | 'dark' | 'blueprint' (default: 'light')
 * - height: string (default: '200px')
 * - showGrid: boolean (default: true)
 * - showScanLine: boolean (default: true)
 * - showCallouts: boolean (default: true)
 * - label: string (optional)
 */
const SectionTransition = ({
  variant = 'light',
  height = '200px',
  showGrid = true,
  showScanLine = true,
  showCallouts = true,
  label = '',
  className,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  // Color scheme based on variant
  const getColors = () => {
    switch (variant) {
      case 'dark':
        return {
          bg: '#050505',
          line: '#EAEAEA',
          grid: '#333',
        };
      case 'blueprint':
        return {
          bg: '#0A1628',
          line: '#64B5F6',
          grid: '#1E3A5F',
        };
      default:
        return {
          bg: '#F9F9F9',
          line: '#FF6B35',
          grid: '#FF6B35',
        };
    }
  };
  
  const colors = getColors();
  
  return (
    <TransitionContainer
      ref={ref}
      height={height}
      background={colors.bg}
      className={className}
    >
      {/* Isometric grid pattern */}
      {showGrid && (
        <IsometricGrid opacity={0.15}>
          <defs>
            <pattern
              id={`isometric-${variant}`}
              x="0"
              y="0"
              width="40"
              height="69.28"
              patternUnits="userSpaceOnUse"
            >
              {/* Isometric diamond pattern */}
              <path
                d="M20,0 L40,17.32 L20,34.64 L0,17.32 Z"
                fill="none"
                stroke={colors.grid}
                strokeWidth="1"
                opacity="0.3"
              />
              <path
                d="M20,34.64 L40,51.96 L20,69.28 L0,51.96 Z"
                fill="none"
                stroke={colors.grid}
                strokeWidth="1"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#isometric-${variant})`} />
          
          {/* Vertical accent lines */}
          <line
            x1="33%"
            y1="0"
            x2="33%"
            y2="100%"
            stroke={colors.grid}
            strokeWidth="1"
            opacity="0.2"
          />
          <line
            x1="66%"
            y1="0"
            x2="66%"
            y2="100%"
            stroke={colors.grid}
            strokeWidth="1"
            opacity="0.2"
          />
        </IsometricGrid>
      )}
      
      {/* Animated scan line */}
      {showScanLine && (
        <ScanLine
          color={colors.line}
          initial={{ top: '-10%', opacity: 0 }}
          animate={isInView ? { top: '110%', opacity: [0, 1, 1, 0] } : {}}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      )}
      
      {/* Technical callouts */}
      {showCallouts && (
        <>
          <TechnicalCallout
            position="top: 30%; left: 10%;"
            color={colors.line}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 0.6, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {label || 'SECTION_BOUNDARY'}
          </TechnicalCallout>
          
          <TechnicalCallout
            position="bottom: 30%; right: 10%;"
            color={colors.line}
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 0.6, x: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            NEXT_MODULE
          </TechnicalCallout>
        </>
      )}
    </TransitionContainer>
  );
};

export default SectionTransition;
