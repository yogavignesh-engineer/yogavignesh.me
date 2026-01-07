import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CAD BLUEPRINT LOADING EXPERIENCE
 * 
 * Phase 1: Line art draws (wireframe outline)
 * Phase 2: Dimensions appear with arrows
 * Phase 3: 3D model fills in (gradient)
 * Phase 4: Blueprint → Real transition (color shift)
 */

// Blueprint colors
const BLUEPRINT = {
  bg: '#0a1628',
  grid: '#1a2d4a',
  line: '#00d4ff',
  dimension: '#ff6b35',
  text: '#66fcf1',
  fill: 'rgba(0, 212, 255, 0.1)',
};

// Animations
const drawLine = keyframes`
  from { stroke-dashoffset: 1000; }
  to { stroke-dashoffset: 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

const scanDown = keyframes`
  0% { top: 0; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
`;

const fillGradient = keyframes`
  from { 
    fill: transparent;
    filter: drop-shadow(0 0 0px ${BLUEPRINT.line});
  }
  to { 
    fill: ${BLUEPRINT.fill};
    filter: drop-shadow(0 0 20px ${BLUEPRINT.line});
  }
`;

// Styled Components
const LoaderWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${BLUEPRINT.bg};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  overflow: hidden;

  /* Blueprint grid */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(${BLUEPRINT.grid} 1px, transparent 1px),
      linear-gradient(90deg, ${BLUEPRINT.grid} 1px, transparent 1px);
    background-size: 40px 40px;
    opacity: 0.5;
  }
`;

const ScanLine = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, ${BLUEPRINT.line}, transparent);
  box-shadow: 0 0 20px ${BLUEPRINT.line};
  animation: ${scanDown} 2s linear infinite;
  z-index: 10;
`;

const BlueprintCanvas = styled.div`
  position: relative;
  width: 400px;
  height: 300px;
  z-index: 5;

  @media (max-width: 768px) {
    width: 300px;
    height: 225px;
  }
`;

// The main 3D gear/part SVG that gets drawn
const BlueprintSVG = styled.svg`
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const DrawPath = styled.path`
  fill: none;
  stroke: ${BLUEPRINT.line};
  stroke-width: 2;
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: ${drawLine} ${props => props.$duration || '2s'} ease-out forwards;
  animation-delay: ${props => props.$delay || '0s'};
  filter: drop-shadow(0 0 5px ${BLUEPRINT.line});
`;

const FillPath = styled.path`
  fill: transparent;
  stroke: ${BLUEPRINT.line};
  stroke-width: 2;
  animation: ${fillGradient} 1s ease-out forwards;
  animation-delay: ${props => props.$delay || '2.5s'};
`;

const DimensionGroup = styled.g`
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-out forwards;
  animation-delay: ${props => props.$delay || '1.5s'};
`;

const DimensionLine = styled.line`
  stroke: ${BLUEPRINT.dimension};
  stroke-width: 1;
  stroke-dasharray: 5, 3;
`;

const DimensionText = styled.text`
  fill: ${BLUEPRINT.dimension};
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: bold;
`;

const DimensionArrow = styled.polygon`
  fill: ${BLUEPRINT.dimension};
`;

const TitleBlock = styled(motion.div)`
  position: absolute;
  bottom: 20px;
  right: 20px;
  border: 1px solid ${BLUEPRINT.line};
  padding: 1rem 1.5rem;
  font-family: 'JetBrains Mono', monospace;
  color: ${BLUEPRINT.text};
  background: rgba(10, 22, 40, 0.9);
  
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  font-size: 0.75rem;
  opacity: 0.7;
  
  &.main {
    font-size: 1rem;
    font-weight: bold;
    opacity: 1;
    color: ${BLUEPRINT.dimension};
  }
`;

const StatusText = styled(motion.div)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: ${BLUEPRINT.text};
  margin-top: 2rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProgressDots = styled.span`
  animation: ${pulse} 1s ease-in-out infinite;
`;

const ProgressBar = styled.div`
  width: 300px;
  height: 3px;
  background: ${BLUEPRINT.grid};
  margin-top: 1rem;
  overflow: hidden;
  border-radius: 2px;

  @media (max-width: 768px) {
    width: 250px;
  }
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, ${BLUEPRINT.line}, ${BLUEPRINT.dimension});
  box-shadow: 0 0 10px ${BLUEPRINT.line};
`;

const CoordinateLabel = styled.div`
  position: absolute;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: ${BLUEPRINT.text};
  opacity: 0.6;
  
  &.origin {
    bottom: 10px;
    left: 10px;
  }
  
  &.x-axis {
    bottom: 10px;
    right: 10px;
  }
  
  &.y-axis {
    top: 10px;
    left: 10px;
  }
`;

// The phases of loading
const PHASES = ['DRAWING WIREFRAME', 'ADDING DIMENSIONS', 'RENDERING GEOMETRY', 'SYSTEM READY'];

const HeroLoader = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Phase progression
    const phaseTimers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 2800),
    ];

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 2, 100));
    }, 60);

    // Complete after full animation
    const completeTimer = setTimeout(() => {
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }, 3500);

    return () => {
      phaseTimers.forEach(clearTimeout);
      clearInterval(progressInterval);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <LoaderWrapper
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.1,
        filter: 'blur(10px)',
        transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
      }}
    >
      <ScanLine />

      <BlueprintCanvas>
        <CoordinateLabel className="origin">0, 0</CoordinateLabel>
        <CoordinateLabel className="x-axis">X+</CoordinateLabel>
        <CoordinateLabel className="y-axis">Y+</CoordinateLabel>

        <BlueprintSVG viewBox="0 0 400 300">
          {/* Main gear outline - draws first */}
          <DrawPath
            d="M200 50 L280 90 L320 160 L280 230 L200 270 L120 230 L80 160 L120 90 Z"
            $duration="1.2s"
            $delay="0.2s"
          />

          {/* Inner circle */}
          <DrawPath
            d="M200 100 A60 60 0 1 1 199.99 100"
            $duration="1s"
            $delay="0.8s"
          />

          {/* Center hole */}
          <DrawPath
            d="M200 140 A20 20 0 1 1 199.99 140"
            $duration="0.6s"
            $delay="1.2s"
          />

          {/* Gear teeth details */}
          <DrawPath
            d="M195 50 L200 30 L205 50 M275 85 L295 75 L285 95"
            $duration="0.5s"
            $delay="1.4s"
          />
          <DrawPath
            d="M320 155 L340 160 L320 165 M280 225 L295 245 L270 235"
            $duration="0.5s"
            $delay="1.5s"
          />

          {/* Dimensions - appear after wireframe */}
          <DimensionGroup $delay="1.8s">
            {/* Width dimension */}
            <DimensionLine x1="80" y1="280" x2="320" y2="280" />
            <DimensionArrow points="80,280 85,277 85,283" />
            <DimensionArrow points="320,280 315,277 315,283" />
            <DimensionText x="190" y="295">240mm</DimensionText>
          </DimensionGroup>

          <DimensionGroup $delay="2s">
            {/* Height dimension */}
            <DimensionLine x1="350" y1="50" x2="350" y2="270" />
            <DimensionArrow points="350,50 347,55 353,55" />
            <DimensionArrow points="350,270 347,265 353,265" />
            <DimensionText x="360" y="165">220mm</DimensionText>
          </DimensionGroup>

          <DimensionGroup $delay="2.2s">
            {/* Center hole dimension */}
            <DimensionLine x1="200" y1="160" x2="250" y2="160" />
            <DimensionText x="255" y="155">Ø40</DimensionText>
          </DimensionGroup>

          {/* Fill effect - last phase */}
          <FillPath
            d="M200 50 L280 90 L320 160 L280 230 L200 270 L120 230 L80 160 L120 90 Z"
            $delay="2.5s"
          />
        </BlueprintSVG>
      </BlueprintCanvas>

      <StatusText
        key={phase}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {PHASES[phase]}
        {phase < 3 && <ProgressDots>...</ProgressDots>}
      </StatusText>

      <ProgressBar>
        <ProgressFill
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </ProgressBar>

      <TitleBlock
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <TitleRow className="main">S. YOGA VIGNESH</TitleRow>
        <TitleRow>
          <span>MECHANICAL ENGINEER</span>
          <span>REV 1.0</span>
        </TitleRow>
        <TitleRow>
          <span>PORTFOLIO</span>
          <span>SCALE 1:1</span>
        </TitleRow>
      </TitleBlock>
    </LoaderWrapper>
  );
};

export default React.memo(HeroLoader);