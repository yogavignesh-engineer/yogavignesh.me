import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// Animations
const glitch = keyframes`
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-3px, 3px); }
  40% { transform: translate(-3px, -3px); }
  60% { transform: translate(3px, 3px); }
  80% { transform: translate(3px, -3px); }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const rotateReverse = keyframes`
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(2deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
`;

const PageContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: radial-gradient(ellipse at center, #111 0%, #050505 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      rgba(255, 107, 53, 0.02),
      rgba(255, 107, 53, 0.02) 1px,
      transparent 1px,
      transparent 3px
    );
    pointer-events: none;
    z-index: 2;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, transparent, #FF6B35, #66FCF1, transparent);
    box-shadow: 0 0 30px rgba(255, 107, 53, 0.8);
    animation: ${scanline} 4s linear infinite;
    z-index: 3;
  }
`;

const GridBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(102, 252, 241, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(102, 252, 241, 0.03) 1px, transparent 1px);
  background-size: 80px 80px;
  pointer-events: none;
  z-index: 0;
`;

// Floating Gears Background
const GearContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
`;

const GearSVG = styled.svg`
  position: absolute;
  opacity: 0.1;
  color: #FF6B35;
  animation: ${props => props.$reverse ? rotateReverse : rotate} ${props => props.$duration || '30s'} linear infinite;
`;

const CenterContent = styled(motion.div)`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
`;

const GearGroup = styled(motion.div)`
  position: relative;
  width: 200px;
  height: 200px;
  margin-bottom: 2rem;
  animation: ${float} 4s ease-in-out infinite;
`;

const MainGear = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;
  color: #FF6B35;
  filter: drop-shadow(0 0 20px rgba(255, 107, 53, 0.5));
  animation: ${rotate} 8s linear infinite;
`;

const SmallGear = styled.svg`
  position: absolute;
  width: 60px;
  height: 60px;
  color: #66FCF1;
  filter: drop-shadow(0 0 10px rgba(102, 252, 241, 0.5));
  animation: ${rotateReverse} 5s linear infinite;
  
  &.gear1 { top: -20px; right: -20px; }
  &.gear2 { bottom: -15px; left: -15px; }
`;

const ErrorCode = styled(motion.h1)`
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(5rem, 18vw, 12rem);
  font-weight: 700;
  color: transparent;
  background: linear-gradient(135deg, #FF6B35 0%, #FF8F35 50%, #FF6B35 100%);
  -webkit-background-clip: text;
  background-clip: text;
  margin: 0;
  text-shadow: 
    0 0 40px rgba(255, 107, 53, 0.4),
    0 0 80px rgba(255, 107, 53, 0.2);
  animation: ${glitch} 3s infinite;
  letter-spacing: -0.05em;
  
  @media (max-width: 768px) {
    font-size: 6rem;
  }
`;

const ErrorMessage = styled(motion.div)`
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: #66FCF1;
  text-align: center;
  margin: 1.5rem 0;
  text-transform: uppercase;
  letter-spacing: 3px;
  line-height: 2;
  max-width: 600px;
  padding: 0 1rem;
  
  span {
    color: #FF6B35;
    font-weight: 600;
  }
`;

const SystemInfo = styled(motion.div)`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: rgba(102, 252, 241, 0.4);
  margin: 1rem 0 2.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding: 0.8rem 1.5rem;
  border: 1px solid rgba(102, 252, 241, 0.1);
  border-radius: 4px;
  background: rgba(102, 252, 241, 0.02);
`;

const ReturnButton = styled(motion(Link))`
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  font-weight: 600;
  color: #050505;
  background: linear-gradient(135deg, #FF6B35 0%, #E85A28 100%);
  padding: 1.2rem 3rem;
  border: none;
  border-radius: 50px;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 3px;
  cursor: pointer;
  box-shadow: 
    0 4px 20px rgba(255, 107, 53, 0.5),
    inset 0 -2px 5px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 
      0 8px 30px rgba(255, 107, 53, 0.7),
      inset 0 -2px 5px rgba(0, 0, 0, 0.2);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-1px) scale(1.02);
  }
`;

// Gear SVG Component
const GearIcon = ({ className, style }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} style={style}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </svg>
);

export default function NotFound() {
  useEffect(() => {
    console.error('[404] Page not found:', window.location.href);
  }, []);

  return (
    <>
      <Helmet>
        <title>404 - Lost in the Machine | S. Yoga Vignesh</title>
        <meta name="description" content="The page you're looking for doesn't exist. Return to S. Yoga Vignesh's portfolio homepage." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <PageContainer>
        <GridBackground />

        {/* Background Gears */}
        <GearContainer>
          <GearSVG as={GearIcon} style={{ top: '10%', left: '5%', width: '150px', height: '150px' }} $duration="40s" />
          <GearSVG as={GearIcon} style={{ top: '20%', right: '10%', width: '100px', height: '100px' }} $reverse $duration="35s" />
          <GearSVG as={GearIcon} style={{ bottom: '15%', left: '15%', width: '120px', height: '120px' }} $duration="45s" />
          <GearSVG as={GearIcon} style={{ bottom: '25%', right: '5%', width: '180px', height: '180px' }} $reverse $duration="50s" />
        </GearContainer>

        <CenterContent
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated Gear Group */}
          <GearGroup
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
          >
            <MainGear as={GearIcon} />
            <SmallGear as={GearIcon} className="gear1" />
            <SmallGear as={GearIcon} className="gear2" />
          </GearGroup>

          <ErrorCode
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          >
            404
          </ErrorCode>

          <ErrorMessage
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <span>// SYSTEM_FAULT</span><br />
            THE COORDINATES YOU ENTERED<br />
            DO NOT CORRESPOND TO ANY BLUEPRINT.
          </ErrorMessage>

          <SystemInfo
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            ERROR_CODE: 0x404 | STATUS: BLUEPRINT_NOT_FOUND
          </SystemInfo>

          <ReturnButton
            to="/"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            → RETURN TO BASE
          </ReturnButton>
        </CenterContent>
      </PageContainer>
    </>
  );
}
